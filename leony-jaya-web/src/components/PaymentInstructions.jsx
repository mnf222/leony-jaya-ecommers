import { BANK_INSTRUCTIONS, QRIS_IMAGE_URL } from '../config';

export default function PaymentInstructions({ method, deadline }) {
  if (method === 'cod') {
    return <p className="text-xs leading-5 text-neutral-400">Pay in cash when your order arrives. We will contact you before shipping.</p>;
  }

  return (
    <div className="space-y-3 text-xs leading-5 text-neutral-400">
      {method === 'qris' && QRIS_IMAGE_URL
        ? <img src={QRIS_IMAGE_URL} alt="QRIS code" className="mx-auto w-56 bg-white p-2" />
        : <p className="whitespace-pre-line text-neutral-200">{BANK_INSTRUCTIONS.replace(/\\n/g, '\n')}</p>}
      <p>
        After paying, open <strong className="text-white">My orders</strong> and upload your proof of payment.
        {deadline && ` Unpaid orders are cancelled automatically after ${new Date(deadline).toLocaleString('id-ID')}.`}
      </p>
    </div>
  );
}
