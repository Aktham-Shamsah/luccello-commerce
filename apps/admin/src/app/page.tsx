import { Activity, Boxes, ShieldCheck, ShoppingBag } from "lucide-react";

const metrics = [
  { label: "Revenue today", value: "SAR 7,448", icon: ShoppingBag },
  { label: "Orders", value: "38", icon: Activity },
  { label: "Low stock SKUs", value: "4", icon: Boxes },
  { label: "Security events", value: "2", icon: ShieldCheck },
];

const products = [
  ["066", "Handbags", "196", "18", "Published"],
  ["065", "CrossBody", "196", "3", "Published"],
  ["064", "Tote Bags", "296", "12", "Draft"],
  ["063", "Shoulder Bags", "196", "0", "Paused"],
];

const orders = [
  ["ORD-1008", "Pending payment", "SAR 352", "Reserved"],
  ["ORD-1007", "Confirmed", "SAR 196", "Deducted"],
  ["ORD-1006", "Cancelled", "SAR 296", "Released"],
];

export default function AdminHome() {
  return (
    <>
      <div className="topbar">
        <div>
          <h2>Operations Dashboard</h2>
          <p>Local seeded metrics. Production auth is Cognito with RBAC and MFA.</p>
        </div>
        <span className="badge">Git SHA: {process.env.GIT_SHA ?? "local"}</span>
      </div>
      <section className="grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article className="card" key={metric.label}>
              <Icon size={22} />
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          );
        })}
      </section>
      <section className="table-wrap">
        <h3>Product Management</h3>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((row) => (
              <tr key={row[0]}>
                {row.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="table-wrap">
        <h3>Order Workflow</h3>
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Status</th>
              <th>Total</th>
              <th>Inventory</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row) => (
              <tr key={row[0]}>
                <td>{row[0]}</td>
                <td>
                  <span className={`status ${row[1] === "Pending payment" ? "warn" : "ok"}`}>
                    {row[1]}
                  </span>
                </td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
