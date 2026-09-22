"use client";

import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";

type Dashboard = {
  products: number;
  users: number;
  orders: number;
  lowStock: number;
  revenue: number;
  currency: "ILS";
};

type Category = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string | null;
  descriptionAr: string | null;
  imageUrl: string | null;
};

type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  href: string | null;
  enabled: boolean;
};

type ProductRow = {
  id: string;
  slug: string;
  sku: string;
  nameAr: string;
  nameEn: string | null;
  shortDescriptionAr: string | null;
  descriptionAr: string;
  color: string | null;
  material: string | null;
  dimensions: string | null;
  notes: string | null;
  salePrice: number;
  regularPrice: number;
  published: boolean;
  featured: boolean;
  newest: boolean;
  sale: boolean;
  imageUrl: string | null;
  categories: Category[];
  inventory: { quantity: number; lowStockThreshold: number } | null;
};

type OrderRow = {
  id: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
};

type UserRow = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

type AdminAnalytics = {
  periodDays: number;
  sessions: { total: number; active24h: number };
  activityByType: { type: string; count: number }[];
  recentActivity: {
    id: string;
    type: string;
    userId: string | null;
    anonymousId: string | null;
    payload: Record<string, unknown>;
    createdAt: string;
  }[];
  advertisements: {
    bannerId: string;
    title: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    clickThroughRate: number;
    conversionRate: number;
  }[];
};

type ProductForm = {
  id?: string;
  slug: string;
  sku: string;
  nameAr: string;
  descriptionAr: string;
  salePrice: string;
  regularPrice: string;
  imageUrl: string;
  categoryId: string;
  inventoryQuantity: string;
  lowStockThreshold: string;
  published: boolean;
};

const emptyProduct: ProductForm = {
  slug: "",
  sku: "",
  nameAr: "",
  descriptionAr: "",
  salePrice: "",
  regularPrice: "",
  imageUrl: "",
  categoryId: "",
  inventoryQuantity: "0",
  lowStockThreshold: "3",
  published: true,
};

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/admin/${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `request_failed_${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

async function uploadAdminImage(file: File) {
  if (file.size > 5 * 1024 * 1024) throw new Error("حجم الصورة يجب ألا يتجاوز 5MB");
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("تعذر قراءة الصورة"));
    reader.readAsDataURL(file);
  });
  const dataBase64 = dataUrl.split(",")[1];
  if (!dataBase64) throw new Error("بيانات الصورة غير صالحة");
  return adminFetch<{ url: string }>("upload", {
    method: "POST",
    body: JSON.stringify({ contentType: file.type, dataBase64 }),
  });
}

export function AdminDashboard() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [categoryForm, setCategoryForm] = useState({ id: "", slug: "", nameAr: "", imageUrl: "" });
  const [bannerForm, setBannerForm] = useState({
    id: "",
    title: "",
    imageUrl: "",
    href: "",
    enabled: true,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const [
        dashboardData,
        productData,
        categoryData,
        bannerData,
        orderData,
        userData,
        analyticsData,
      ] = await Promise.all([
        adminFetch<Dashboard>("dashboard"),
        adminFetch<ProductRow[]>("products"),
        adminFetch<Category[]>("categories"),
        adminFetch<Banner[]>("banners"),
        adminFetch<OrderRow[]>("orders"),
        adminFetch<UserRow[]>("users"),
        adminFetch<AdminAnalytics>("analytics"),
      ]);
      setDashboard(dashboardData);
      setProducts(productData);
      setCategories(categoryData);
      setBanners(bannerData);
      setOrders(orderData);
      setUsers(userData);
      setAnalytics(analyticsData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "تعذر تحميل لوحة الإدارة");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    applyUrl: (url: string) => void,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const { url } = await uploadAdminImage(file);
      applyUrl(url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "تعذر رفع الصورة");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const payload = {
      slug: productForm.slug,
      sku: productForm.sku,
      nameAr: productForm.nameAr,
      descriptionAr: productForm.descriptionAr,
      salePrice: Number(productForm.salePrice),
      regularPrice: Number(productForm.regularPrice),
      imageUrl: productForm.imageUrl,
      categoryIds: productForm.categoryId ? [productForm.categoryId] : [],
      inventoryQuantity: Number(productForm.inventoryQuantity),
      lowStockThreshold: Number(productForm.lowStockThreshold),
      published: productForm.published,
      featured: false,
      newest: false,
      sale: Number(productForm.salePrice) < Number(productForm.regularPrice),
    };
    try {
      await adminFetch(productForm.id ? `products/${productForm.id}` : "products", {
        method: productForm.id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      setProductForm(emptyProduct);
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "تعذر حفظ المنتج");
    } finally {
      setBusy(false);
    }
  }

  function editProduct(product: ProductRow) {
    setProductForm({
      id: product.id,
      slug: product.slug,
      sku: product.sku,
      nameAr: product.nameAr,
      descriptionAr: product.descriptionAr,
      salePrice: String(product.salePrice),
      regularPrice: String(product.regularPrice),
      imageUrl: product.imageUrl ?? "",
      categoryId: product.categories[0]?.id ?? "",
      inventoryQuantity: String(product.inventory?.quantity ?? 0),
      lowStockThreshold: String(product.inventory?.lowStockThreshold ?? 3),
      published: product.published,
    });
    document.querySelector("#product-editor")?.scrollIntoView({ behavior: "smooth" });
  }

  async function removeProduct(id: string) {
    if (!window.confirm("حذف هذا المنتج من المتجر؟")) return;
    await adminFetch(`products/${id}`, { method: "DELETE" });
    await load();
  }

  async function saveCategory(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await adminFetch(categoryForm.id ? `categories/${categoryForm.id}` : "categories", {
        method: categoryForm.id ? "PATCH" : "POST",
        body: JSON.stringify({
          slug: categoryForm.slug,
          nameAr: categoryForm.nameAr,
          imageUrl: categoryForm.imageUrl,
        }),
      });
      setCategoryForm({ id: "", slug: "", nameAr: "", imageUrl: "" });
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "تعذر حفظ الفئة");
    } finally {
      setBusy(false);
    }
  }

  async function removeCategory(id: string) {
    if (!window.confirm("حذف هذه الفئة؟")) return;
    try {
      await adminFetch(`categories/${id}`, { method: "DELETE" });
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "تعذر حذف الفئة");
    }
  }

  async function saveBanner(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await adminFetch(bannerForm.id ? `banners/${bannerForm.id}` : "banners", {
        method: bannerForm.id ? "PATCH" : "POST",
        body: JSON.stringify({
          title: bannerForm.title,
          imageUrl: bannerForm.imageUrl,
          href: bannerForm.href || null,
          enabled: bannerForm.enabled,
        }),
      });
      setBannerForm({ id: "", title: "", imageUrl: "", href: "", enabled: true });
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "تعذر حفظ البانر");
    } finally {
      setBusy(false);
    }
  }

  async function removeBanner(id: string) {
    if (!window.confirm("حذف هذا البانر؟")) return;
    await adminFetch(`banners/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="admin-dashboard">
      <div className="topbar">
        <div>
          <h2>لوحة إدارة LU&apos;CHÉLO</h2>
          <p>إدارة المنتجات والمخزون والفئات والطلبات والعملاء والبانر من قاعدة البيانات.</p>
        </div>
        <button className="admin-btn secondary" type="button" onClick={() => void load()}>
          تحديث البيانات
        </button>
      </div>

      {error ? <div className="admin-error">{error}</div> : null}

      <section className="grid metrics-grid" id="dashboard">
        <article className="card">
          <span>المنتجات</span>
          <strong>{dashboard?.products ?? "—"}</strong>
        </article>
        <article className="card">
          <span>الطلبات</span>
          <strong>{dashboard?.orders ?? "—"}</strong>
        </article>
        <article className="card">
          <span>العملاء</span>
          <strong>{dashboard?.users ?? "—"}</strong>
        </article>
        <article className="card">
          <span>مخزون منخفض</span>
          <strong>{dashboard?.lowStock ?? "—"}</strong>
        </article>
        <article className="card revenue-card">
          <span>إجمالي المبيعات</span>
          <strong>{dashboard ? `${dashboard.revenue.toLocaleString("ar")} شيكل` : "—"}</strong>
        </article>
      </section>

      <section className="admin-section" id="product-editor">
        <div className="section-heading">
          <div>
            <h3>{productForm.id ? "تعديل المنتج" : "إضافة منتج"}</h3>
            <p>
              رابط الصورة يُحفظ في جدول صور المنتجات، وإذا كان فارغاً أو معطلاً سيظهر البديل
              تلقائياً.
            </p>
          </div>
          {productForm.id ? (
            <button
              className="admin-btn secondary"
              type="button"
              onClick={() => setProductForm(emptyProduct)}
            >
              إلغاء التعديل
            </button>
          ) : null}
        </div>
        <form className="admin-form" onSubmit={saveProduct}>
          <label>
            اسم المنتج
            <input
              required
              value={productForm.nameAr}
              onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
            />
          </label>
          <label>
            SKU
            <input
              required
              value={productForm.sku}
              onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
            />
          </label>
          <label>
            Slug
            <input
              required
              value={productForm.slug}
              onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
            />
          </label>
          <label>
            السعر
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={productForm.salePrice}
              onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
            />
          </label>
          <label>
            السعر قبل الخصم
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={productForm.regularPrice}
              onChange={(e) => setProductForm({ ...productForm, regularPrice: e.target.value })}
            />
          </label>
          <label>
            صورة المنتج
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={busy}
              onChange={(e) =>
                void handleImageUpload(e, (url) =>
                  setProductForm({ ...productForm, imageUrl: url }),
                )
              }
            />
            <small className="field-hint">
              {productForm.imageUrl || "سيُنشأ رابط الصورة بعد الرفع"}
            </small>
          </label>
          <label>
            الفئة
            <select
              value={productForm.categoryId}
              onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
            >
              <option value="">بدون فئة</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameAr}
                </option>
              ))}
            </select>
          </label>
          <label>
            المخزون
            <input
              type="number"
              min="0"
              value={productForm.inventoryQuantity}
              onChange={(e) =>
                setProductForm({ ...productForm, inventoryQuantity: e.target.value })
              }
            />
          </label>
          <label>
            حد المخزون المنخفض
            <input
              type="number"
              min="0"
              value={productForm.lowStockThreshold}
              onChange={(e) =>
                setProductForm({ ...productForm, lowStockThreshold: e.target.value })
              }
            />
          </label>
          <label className="wide-field">
            الوصف
            <textarea
              required
              rows={4}
              value={productForm.descriptionAr}
              onChange={(e) => setProductForm({ ...productForm, descriptionAr: e.target.value })}
            />
          </label>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={productForm.published}
              onChange={(e) => setProductForm({ ...productForm, published: e.target.checked })}
            />{" "}
            منشور في المتجر
          </label>
          <div className="form-actions">
            <button className="admin-btn" type="submit" disabled={busy}>
              {productForm.id ? "حفظ التعديلات" : "إضافة المنتج"}
            </button>
          </div>
        </form>
      </section>

      <section className="table-wrap" id="products">
        <div className="section-heading">
          <div>
            <h3>المنتجات والمخزون</h3>
            <p>الأسعار بالشيكل وروابط الصور تأتي من قاعدة البيانات.</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th>الفئة</th>
              <th>السعر</th>
              <th>المخزون</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.nameAr}</strong>
                  <small className="table-sub">{product.sku}</small>
                </td>
                <td>{product.categories.map((category) => category.nameAr).join("، ") || "—"}</td>
                <td>{product.salePrice.toLocaleString("ar")} شيكل</td>
                <td>{product.inventory?.quantity ?? 0}</td>
                <td>
                  <span className={`status ${product.published ? "ok" : "warn"}`}>
                    {product.published ? "منشور" : "مسودة"}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button type="button" onClick={() => editProduct(product)}>
                      تعديل
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => void removeProduct(product.id)}
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="admin-section" id="categories">
        <div className="section-heading">
          <div>
            <h3>الفئات</h3>
            <p>صورة الفئة تستخدم كبانر للفئة في المتجر مع زر عرض الكل.</p>
          </div>
        </div>
        <form className="admin-form compact-form" onSubmit={saveCategory}>
          <label>
            اسم الفئة
            <input
              required
              value={categoryForm.nameAr}
              onChange={(e) => setCategoryForm({ ...categoryForm, nameAr: e.target.value })}
            />
          </label>
          <label>
            Slug
            <input
              required
              value={categoryForm.slug}
              onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
            />
          </label>
          <label>
            صورة الفئة
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={busy}
              onChange={(e) =>
                void handleImageUpload(e, (url) =>
                  setCategoryForm({ ...categoryForm, imageUrl: url }),
                )
              }
            />
            <small className="field-hint">
              {categoryForm.imageUrl || "سيُنشأ رابط الصورة بعد الرفع"}
            </small>
          </label>
          <div className="form-actions">
            <button className="admin-btn" disabled={busy} type="submit">
              {categoryForm.id ? "حفظ الفئة" : "إضافة فئة"}
            </button>
          </div>
        </form>
        <div className="admin-card-list">
          {categories.map((category) => (
            <article className="admin-list-card" key={category.id}>
              <div>
                <strong>{category.nameAr}</strong>
                <small>{category.slug}</small>
              </div>
              <div className="row-actions">
                <button
                  type="button"
                  onClick={() =>
                    setCategoryForm({
                      id: category.id,
                      slug: category.slug,
                      nameAr: category.nameAr,
                      imageUrl: category.imageUrl ?? "",
                    })
                  }
                >
                  تعديل
                </button>
                <button
                  className="danger"
                  type="button"
                  onClick={() => void removeCategory(category.id)}
                >
                  حذف
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section" id="banners">
        <div className="section-heading">
          <div>
            <h3>البانر أسفل الهيدر</h3>
            <p>أضف أو عدّل أو احذف البانرات. أول بانر مفعّل هو الذي يظهر في المتجر.</p>
          </div>
        </div>
        <form className="admin-form compact-form" onSubmit={saveBanner}>
          <label>
            العنوان
            <input
              required
              value={bannerForm.title}
              onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
            />
          </label>
          <label>
            صورة البانر
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={busy}
              onChange={(e) =>
                void handleImageUpload(e, (url) => setBannerForm({ ...bannerForm, imageUrl: url }))
              }
            />
            <small className="field-hint">
              {bannerForm.imageUrl || "سيُنشأ رابط الصورة بعد الرفع"}
            </small>
          </label>
          <label>
            الرابط عند الضغط
            <input
              value={bannerForm.href}
              onChange={(e) => setBannerForm({ ...bannerForm, href: e.target.value })}
            />
          </label>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={bannerForm.enabled}
              onChange={(e) => setBannerForm({ ...bannerForm, enabled: e.target.checked })}
            />{" "}
            مفعّل
          </label>
          <div className="form-actions">
            <button className="admin-btn" disabled={busy} type="submit">
              {bannerForm.id ? "حفظ البانر" : "إضافة بانر"}
            </button>
          </div>
        </form>
        <div className="admin-card-list">
          {banners.map((banner) => (
            <article className="admin-list-card" key={banner.id}>
              <div>
                <strong>{banner.title}</strong>
                <small>{banner.enabled ? "مفعّل" : "غير مفعّل"}</small>
              </div>
              <div className="row-actions">
                <button
                  type="button"
                  onClick={() =>
                    setBannerForm({
                      id: banner.id,
                      title: banner.title,
                      imageUrl: banner.imageUrl,
                      href: banner.href ?? "",
                      enabled: banner.enabled,
                    })
                  }
                >
                  تعديل
                </button>
                <button
                  className="danger"
                  type="button"
                  onClick={() => void removeBanner(banner.id)}
                >
                  حذف
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section" id="analytics">
        <div className="section-heading">
          <div>
            <h3>نشاط المستخدمين والتحليلات</h3>
            <p>ملخص الجلسات والنشاط المصرّح به خلال آخر {analytics?.periodDays ?? 7} أيام.</p>
          </div>
        </div>
        <div className="grid analytics-summary-grid">
          <article className="card">
            <span>إجمالي الجلسات</span>
            <strong>{analytics?.sessions.total ?? 0}</strong>
          </article>
          <article className="card">
            <span>نشطة آخر 24 ساعة</span>
            <strong>{analytics?.sessions.active24h ?? 0}</strong>
          </article>
          {(analytics?.activityByType ?? []).map((item) => (
            <article className="card" key={item.type}>
              <span>{item.type}</span>
              <strong>{item.count}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="table-wrap" id="advertising-metrics">
        <div className="section-heading">
          <div>
            <h3>مؤشرات الإعلانات</h3>
            <p>الظهور والنقر والتحويل والعائد لكل بانر.</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>البانر</th>
              <th>الظهور</th>
              <th>النقرات</th>
              <th>CTR</th>
              <th>التحويلات</th>
              <th>معدل التحويل</th>
              <th>العائد</th>
            </tr>
          </thead>
          <tbody>
            {(analytics?.advertisements ?? []).map((metric) => (
              <tr key={metric.bannerId}>
                <td>{metric.title}</td>
                <td>{metric.impressions}</td>
                <td>{metric.clicks}</td>
                <td>{metric.clickThroughRate.toFixed(1)}%</td>
                <td>{metric.conversions}</td>
                <td>{metric.conversionRate.toFixed(1)}%</td>
                <td>{metric.revenue.toLocaleString("ar")} شيكل</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="table-wrap" id="user-activity">
        <div className="section-heading">
          <div>
            <h3>أحدث نشاط المستخدمين</h3>
            <p>يُسجل فقط بعد قبول ملفات التحليلات.</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>الحدث</th>
              <th>المستخدم / الجلسة</th>
              <th>المسار</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {(analytics?.recentActivity ?? []).map((event) => (
              <tr key={event.id}>
                <td>{event.type}</td>
                <td>{event.userId?.slice(0, 8) ?? event.anonymousId?.slice(0, 8) ?? "—"}</td>
                <td>{String(event.payload.path ?? event.payload.bannerId ?? "—")}</td>
                <td>{new Date(event.createdAt).toLocaleString("ar")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="table-wrap" id="orders">
        <div className="section-heading">
          <div>
            <h3>المشتريات / الطلبات</h3>
            <p>سجل الطلبات المحفوظ في قاعدة البيانات.</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>الطلب</th>
              <th>الحالة</th>
              <th>الإجمالي</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id.slice(0, 8)}</td>
                <td>{order.status}</td>
                <td>{order.total.toLocaleString("ar")} شيكل</td>
                <td>{new Date(order.createdAt).toLocaleDateString("ar")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="table-wrap" id="users">
        <div className="section-heading">
          <div>
            <h3>المستخدمون</h3>
            <p>حسابات العملاء المسجلة في قاعدة البيانات.</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>تاريخ التسجيل</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString("ar")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
