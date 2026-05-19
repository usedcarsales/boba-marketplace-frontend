"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  status: string;
  created_at: string;
  paid_at: string | null;
  quantity: number;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  buyer_note: string | null;
  ship_to: {
    name: string;
    address1: string;
    address2: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  card: {
    name: string;
    set_name: string;
    card_number: string;
    parallel: string;
    weapon: string;
    image_url: string | null;
  } | null;
  listing_title: string;
  listing_condition: string;
  buyer: {
    username: string;
    display_name: string | null;
  } | null;
}

interface PackingSlipProps {
  order: OrderItem;
  sellerName: string;
  onClose: () => void;
}

export default function PackingSlip({ order, sellerName, onClose }: PackingSlipProps) {
  const [printWindow, setPrintWindow] = useState<Window | null>(null);

  const generateHTML = () => {
    const cardName = order.card?.name || order.listing_title;
    const setName = order.card?.set_name || "—";
    const cardNumber = order.card?.card_number || "—";
    const condition = order.listing_condition || "—";
    const date = new Date().toLocaleDateString();

    return `
<!DOCTYPE html>
<html>
<head>
  <title>Packing Slip — BoBA Trader</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      width: 4in;
      max-width: 4in;
      padding: 0.25in;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .header h1 {
      font-family: Impact, 'Arial Black', sans-serif;
      font-size: 18pt;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .header .tag {
      font-size: 8pt;
      color: #666;
      margin-top: 2px;
    }
    .section { margin-bottom: 10px; }
    .section-title {
      font-weight: bold;
      font-size: 9pt;
      text-transform: uppercase;
      border-bottom: 1px solid #ccc;
      margin-bottom: 4px;
      padding-bottom: 2px;
    }
    .address-block {
      background: #f5f5f5;
      padding: 8px;
      border: 1px solid #ddd;
    }
    .item-block {
      border: 2px solid #000;
      padding: 8px;
      margin-bottom: 8px;
    }
    .item-name {
      font-weight: bold;
      font-size: 11pt;
    }
    .item-details {
      font-size: 9pt;
      color: #333;
    }
    .footer {
      margin-top: 12px;
      padding-top: 8px;
      border-top: 1px solid #ccc;
      font-size: 8pt;
      text-align: center;
      color: #666;
    }
    .barcode-area {
      text-align: center;
      padding: 8px;
      border: 1px dashed #999;
      margin: 8px 0;
    }
    .barcode-area span {
      font-family: 'Libre Barcode 39', 'Code 39', monospace;
      font-size: 24pt;
    }
    @media print {
      body { width: 4in; padding: 0.25in; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>BoBA TRADER</h1>
    <div class="tag">Packing Slip · Order #${order.id.slice(0,8).toUpperCase()} · ${date}</div>
  </div>

  <div class="section">
    <div class="section-title">Ship To</div>
    <div class="address-block">
      <strong>${order.ship_to.name}</strong><br>
      ${order.ship_to.address1}<br>
      ${order.ship_to.address2 ? order.ship_to.address2 + '<br>' : ''}
      ${order.ship_to.city}, ${order.ship_to.state} ${order.ship_to.zip}<br>
      ${order.ship_to.country}
    </div>
  </div>

  <div class="section">
    <div class="section-title">From (Seller)</div>
    <div class="address-block">
      <strong>${sellerName}</strong><br>
      Via BoBA Trader Marketplace<br>
      Particulate LLC
    </div>
  </div>

  <div class="section">
    <div class="section-title">Item</div>
    <div class="item-block">
      <div class="item-name">${cardName}</div>
      <div class="item-details">
        Set: ${setName} · Card #${cardNumber} · ${condition}<br>
        Qty: ${order.quantity} · Price: $${(order.subtotal_cents / 100).toFixed(2)}<br>
        Shipping: $${(order.shipping_cents / 100).toFixed(2)} · Total: $${(order.total_cents / 100).toFixed(2)}
      </div>
    </div>
  </div>

  ${order.buyer_note ? `
  <div class="section">
    <div class="section-title">Buyer Note</div>
    <p>${order.buyer_note}</p>
  </div>
  ` : ''}

  <div class="barcode-area">
    <span>*${order.id.slice(0,12).toUpperCase()}*</span><br>
    <small>${order.id.slice(0,12).toUpperCase()}</small>
  </div>

  <div class="footer">
    BoBA Trader · bobamarket.gg · Particulate LLC<br>
    Thank you for your purchase! · 8% fee + $0.25/order<br>
    Questions? Email james@particulatellc.com
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
    `;
  };

  const openPrintWindow = () => {
    const win = window.open("", "_blank", "width=420,height=600");
    if (!win) {
      alert("Please allow popups to print packing slips");
      return;
    }
    setPrintWindow(win);
    win.document.write(generateHTML());
    win.document.close();
  };

  return (
    <>
      <button
        onClick={openPrintWindow}
        className="text-base text-hex hover:text-hex-light font-display font-bold uppercase tracking-wider inline-flex items-center gap-2"
      >
        🖨️ Print Packing Slip
      </button>

      {printWindow && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="card border border-white/20 p-6 max-w-sm">
            <p className="text-white text-center mb-4">
              Packing slip opened in a new window.<br />
              Your browser print dialog should appear automatically.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  printWindow?.print();
                }}
                className="btn-primary flex-1"
              >
                Print Again
              </button>
              <button
                onClick={() => {
                  printWindow?.close();
                  setPrintWindow(null);
                  onClose();
                }}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
