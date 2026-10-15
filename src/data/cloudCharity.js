import { generateClient } from 'aws-amplify/data';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { getVerifiedCauses as getLocalVerifiedCauses } from './causes';

const client = generateClient();

function throwModelErrors(result, action) {
  if (result?.errors?.length) {
    throw new Error(`${action}: ${result.errors.map((e) => e.message).join('; ')}`);
  }
  return result?.data;
}

function mapSubmission(item) {
  return {
    ...item,
    id: item.id,
    name: item.name,
    category: item.category,
    location: item.location,
    targetAmount: Number(item.targetAmount ?? 0),
    raisedAmount: Number(item.raisedAmount ?? 0),
    urgency: item.urgency ?? 'Medium',
    beneficiary: item.beneficiary ?? 'Communities',
    description: item.description ?? '',
    registrationNumber: item.registrationNumber ?? '',
    documentName: item.documentName ?? '',
    collectorEmail: item.collectorEmail ?? '',
    collectorName: item.collectorName ?? '',
    status: item.status ?? 'PENDING',
    adminNote: item.adminNote ?? '',
    source: 'aws',
  };
}

function mapCampaign(item) {
  return {
    ...item,
    id: item.id,
    name: item.name,
    category: item.category,
    location: item.location,
    targetAmount: Number(item.targetAmount ?? 0),
    raisedAmount: Number(item.raisedAmount ?? 0),
    urgency: item.urgency ?? 'Medium',
    beneficiary: item.beneficiary ?? 'Communities',
    description: item.description ?? '',
    status: 'VERIFIED',
    source: 'aws',
  };
}

export async function listMyCauseSubmissions() {
  const result = await client.models.CauseSubmission.list({ limit: 100 });
  const rows = throwModelErrors(result, 'Could not load submitted causes') ?? [];
  return rows.map(mapSubmission);
}

export async function listCloudCampaigns() {
  const result = await client.models.Campaign.list({ limit: 100 });
  const rows = throwModelErrors(result, 'Could not load approved campaigns') ?? [];
  return rows.map(mapCampaign);
}

export async function loadVerifiedCauses() {
  // Keep the five built-in sample causes for the prototype; cloud campaigns are loaded from AWS.
  const local = getLocalVerifiedCauses().filter((cause) => !cause.collectorEmail);
  const cloud = await listCloudCampaigns();
  const ids = new Set(local.map((cause) => String(cause.id)));
  return [...local, ...cloud.filter((cause) => !ids.has(String(cause.id)))];
}

export async function loadVerifiedCauseById(id) {
  const causes = await loadVerifiedCauses();
  return causes.find((cause) => String(cause.id) === String(id)) ?? null;
}

export async function submitCause(values, file) {
  let supportingDocumentKey;
  if (file) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const upload = uploadData({
      path: ({ identityId }) => `verification-documents/${identityId}/${Date.now()}-${safeName}`,
      data: file,
      options: file.type ? { contentType: file.type } : undefined,
    });
    const uploaded = await upload.result;
    supportingDocumentKey = uploaded.path;
  }

  const result = await client.models.CauseSubmission.create({
    name: values.name,
    category: values.category,
    location: values.location,
    targetAmount: Number(values.targetAmount),
    urgency: values.urgency,
    beneficiary: values.beneficiary,
    description: values.description,
    registrationNumber: values.registrationNumber,
    documentName: file?.name ?? '',
    supportingDocumentKey,
    collectorEmail: values.collectorEmail ?? '',
    collectorName: values.collectorName ?? '',
    raisedAmount: 0,
    status: 'PENDING',
  });
  const created = throwModelErrors(result, 'Could not submit the cause');
  if (!created) throw new Error('AWS did not return the created cause.');
  return mapSubmission(created);
}

export async function reviewCause(cause, status, adminNote = '') {
  if (!['VERIFIED', 'REJECTED'].includes(status)) {
    throw new Error('Unsupported review status.');
  }

  // Publish once so a retry after a partial failure will not create duplicate campaigns.
  if (status === 'VERIFIED') {
    const existing = await listCloudCampaigns();
    const alreadyPublished = existing.some(
      (campaign) => campaign.causeSubmissionId === cause.id,
    );
    if (!alreadyPublished) {
      const createResult = await client.models.Campaign.create({
        causeSubmissionId: cause.id,
        name: cause.name,
        category: cause.category,
        location: cause.location,
        targetAmount: Number(cause.targetAmount),
        urgency: cause.urgency,
        beneficiary: cause.beneficiary,
        description: cause.description,
        raisedAmount: Number(cause.raisedAmount ?? 0),
        supportingDocumentKey: cause.supportingDocumentKey ?? undefined,
      });
      throwModelErrors(createResult, 'Cause approved but campaign publishing failed');
    }
  }

  const updateResult = await client.models.CauseSubmission.update({
    id: cause.id,
    status,
    adminNote: adminNote.trim(),
  });
  const updated = throwModelErrors(updateResult, 'Could not update the cause review status');
  if (!updated) throw new Error('AWS did not return the updated cause.');
  return mapSubmission(updated);
}

export async function openSupportingDocument(path) {
  if (!path) throw new Error('No supporting document was uploaded for this cause.');
  const result = await getUrl({ path });
  window.open(result.url.toString(), '_blank', 'noopener,noreferrer');
}

export async function listMyDonations() {
  const result = await client.models.Donation.list({ limit: 100 });
  const rows = throwModelErrors(result, 'Could not load donations') ?? [];
  return rows.map((item) => ({
    ...item,
    id: item.id,
    causeId: item.campaignId,
    causeName: item.causeName,
    category: item.category ?? '',
    amount: Number(item.amount ?? 0),
    date: item.donationDate ? new Date(item.donationDate).toLocaleDateString() : '',
  }));
}

export async function recordSimulatedDonation(cause, amount) {
  const result = await client.models.Donation.create({
    campaignId: String(cause.id),
    causeName: cause.name,
    category: cause.category,
    amount: Number(amount),
    donationDate: new Date().toISOString(),
    note: 'Simulated donation; no payment was processed.',
  });
  const created = throwModelErrors(result, 'Could not record the donation');
  if (!created) throw new Error('AWS did not return the donation record.');
  return created;
}
