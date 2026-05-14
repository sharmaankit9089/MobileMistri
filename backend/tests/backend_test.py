"""MobileMistri backend API tests"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://quick-phone-repair-4.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@mobilemistri.com"
ADMIN_PASSWORD = "MobileMistri@2026"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data and data["email"] == ADMIN_EMAIL
    return data["access_token"]


# ---------- public ----------
class TestPublic:
    def test_health(self, session):
        r = session.get(f"{API}/", timeout=10)
        assert r.status_code == 200
        d = r.json()
        assert d.get("service") == "MobileMistri"
        assert d.get("status") == "ok"

    def test_content(self, session):
        r = session.get(f"{API}/content", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert len(d["brands"]) == 9, f"expected 9 brands, got {len(d['brands'])}"
        assert len(d["cities"]) == 10
        assert len(d["services"]) == 9, f"expected 9 services, got {len(d['services'])}"
        # verify Logic Board service exists
        svc_slugs = [s["slug"] for s in d["services"]]
        assert "logic-board" in svc_slugs
        lb = next(s for s in d["services"] if s["slug"] == "logic-board")
        assert "Logic Board" in lb["name"]
        assert lb["icon"] == "Microchip"
        assert "issues" in d and "faq" in d and "testimonials" in d
        # verify 'other' brand exists
        slugs = [b["slug"] for b in d["brands"]]
        assert "other" in slugs, f"missing 'other' brand. slugs={slugs}"
        other = next(b for b in d["brands"] if b["slug"] == "other")
        assert other["name"] == "Other brand"
        # every brand's models must end with 'Other model (specify)'
        for b in d["brands"]:
            assert b["models"][-1] == "Other model (specify)", f"{b['slug']} last model is {b['models'][-1]}"
        # verify no mongo _id
        assert "_id" not in str(d)

    def test_enquiry_with_other_brand_and_custom_model(self, session):
        payload = {"name": "TEST_OtherBrand", "phone": "9876543210", "city": "Delhi",
                   "brand": "other", "model": "Vivo V30 Pro", "issue": "Screen", "source": "pytest"}
        r = session.post(f"{API}/enquiries", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["brand"] == "other"
        assert d["model"] == "Vivo V30 Pro"

    def test_booking_with_other_brand_and_custom_model(self, session):
        payload = {"name": "TEST_OtherBooking", "phone": "9876500001", "city": "Mumbai",
                   "address": "B2, Link Road", "brand": "other", "model": "Tecno Spark 20 Pro",
                   "issue": "Battery"}
        r = session.post(f"{API}/bookings", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["brand"] == "other"
        assert d["model"] == "Tecno Spark 20 Pro"

    def test_enquiry_create(self, session):
        payload = {"name": "TEST_Ravi", "phone": "9876543210", "city": "Delhi",
                   "brand": "Apple", "model": "iPhone 13", "issue": "Screen", "source": "pytest"}
        r = session.post(f"{API}/enquiries", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["name"] == "TEST_Ravi"
        assert d["phone"] == "9876543210"
        assert "id" in d and d["status"] == "new"
        assert "_id" not in d

    def test_enquiry_missing_fields(self, session):
        r = session.post(f"{API}/enquiries", json={"name": "X"}, timeout=10)
        assert r.status_code == 422

    def test_booking_create(self, session):
        payload = {"name": "TEST_Anita", "phone": "9876500000", "city": "Mumbai",
                   "address": "A1, MG Road", "brand": "Samsung", "model": "Galaxy S23",
                   "issue": "Battery", "email": "test@example.com"}
        r = session.post(f"{API}/bookings", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["name"] == "TEST_Anita"
        assert d["brand"] == "Samsung"
        assert d["city"] == "Mumbai"
        assert "id" in d and "_id" not in d

    def test_booking_missing_fields(self, session):
        r = session.post(f"{API}/bookings", json={"name": "X", "phone": "9"}, timeout=10)
        assert r.status_code == 422


# ---------- admin auth ----------
class TestAdminAuth:
    def test_login_success(self, session):
        r = session.post(f"{API}/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["access_token"] and d["email"] == ADMIN_EMAIL and d["role"] == "admin"

    def test_login_wrong_password(self, session):
        r = session.post(f"{API}/admin/login", json={"email": ADMIN_EMAIL, "password": "wrong"}, timeout=10)
        assert r.status_code == 401

    def test_login_unknown_user(self, session):
        r = session.post(f"{API}/admin/login", json={"email": "nope@x.com", "password": "x"}, timeout=10)
        assert r.status_code == 401

    def test_enquiries_requires_auth(self, session):
        r = session.get(f"{API}/admin/enquiries", timeout=10)
        assert r.status_code == 401

    def test_bookings_requires_auth(self, session):
        r = session.get(f"{API}/admin/bookings", timeout=10)
        assert r.status_code == 401


# ---------- admin data ----------
class TestAdminData:
    def _h(self, tok): return {"Authorization": f"Bearer {tok}", "Content-Type": "application/json"}

    def test_list_enquiries(self, session, admin_token):
        r = session.get(f"{API}/admin/enquiries", headers=self._h(admin_token), timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert any(i.get("name") == "TEST_Ravi" for i in items), "created enquiry not present"
        for i in items:
            assert "_id" not in i

    def test_list_bookings(self, session, admin_token):
        r = session.get(f"{API}/admin/bookings", headers=self._h(admin_token), timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert any(i.get("name") == "TEST_Anita" for i in items)
        for i in items:
            assert "_id" not in i

    def test_stats(self, session, admin_token):
        r = session.get(f"{API}/admin/stats", headers=self._h(admin_token), timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "enquiries" in d and "bookings" in d and "new_enquiries" in d
        assert d["enquiries"] >= 1 and d["bookings"] >= 1

    def test_invalid_token(self, session):
        r = session.get(f"{API}/admin/stats", headers={"Authorization": "Bearer bad.token.x"}, timeout=10)
        assert r.status_code == 401


# ---------- status updates: PATCH enquiries / bookings ----------
class TestStatusUpdates:
    def _h(self, tok): return {"Authorization": f"Bearer {tok}", "Content-Type": "application/json"}

    def _create_enquiry(self, session):
        r = session.post(f"{API}/enquiries", json={
            "name": "TEST_StatusEnq", "phone": "9000011111", "city": "Delhi",
            "brand": "Apple", "model": "iPhone 14", "issue": "Battery", "source": "pytest"
        }, timeout=15)
        assert r.status_code == 200
        return r.json()["id"]

    def _create_booking(self, session):
        r = session.post(f"{API}/bookings", json={
            "name": "TEST_StatusBook", "phone": "9000022222", "city": "Mumbai",
            "address": "Z 1", "brand": "Samsung", "model": "Galaxy S24",
            "issue": "Screen"
        }, timeout=15)
        assert r.status_code == 200
        return r.json()["id"]

    # enquiries
    def test_patch_enquiry_status_unauth(self, session):
        eid = self._create_enquiry(session)
        r = session.patch(f"{API}/admin/enquiries/{eid}/status", json={"status": "contacted"}, timeout=10)
        assert r.status_code == 401

    def test_patch_enquiry_status_invalid(self, session, admin_token):
        eid = self._create_enquiry(session)
        r = session.patch(f"{API}/admin/enquiries/{eid}/status",
                          json={"status": "bogus"}, headers=self._h(admin_token), timeout=10)
        assert r.status_code == 400

    def test_patch_enquiry_status_not_found(self, session, admin_token):
        r = session.patch(f"{API}/admin/enquiries/does-not-exist/status",
                          json={"status": "contacted"}, headers=self._h(admin_token), timeout=10)
        assert r.status_code == 404

    def test_patch_enquiry_status_success_and_persist(self, session, admin_token):
        eid = self._create_enquiry(session)
        for new_status in ["contacted", "converted", "lost", "new"]:
            r = session.patch(f"{API}/admin/enquiries/{eid}/status",
                              json={"status": new_status}, headers=self._h(admin_token), timeout=10)
            assert r.status_code == 200, r.text
            assert r.json()["status"] == new_status
            # verify persisted
            lst = session.get(f"{API}/admin/enquiries", headers=self._h(admin_token), timeout=10).json()
            row = next((x for x in lst if x["id"] == eid), None)
            assert row is not None and row["status"] == new_status

    # bookings
    def test_patch_booking_status_unauth(self, session):
        bid = self._create_booking(session)
        r = session.patch(f"{API}/admin/bookings/{bid}/status", json={"status": "contacted"}, timeout=10)
        assert r.status_code == 401

    def test_patch_booking_status_invalid(self, session, admin_token):
        bid = self._create_booking(session)
        r = session.patch(f"{API}/admin/bookings/{bid}/status",
                          json={"status": "spam"}, headers=self._h(admin_token), timeout=10)
        assert r.status_code == 400

    def test_patch_booking_status_not_found(self, session, admin_token):
        r = session.patch(f"{API}/admin/bookings/missing-id/status",
                          json={"status": "contacted"}, headers=self._h(admin_token), timeout=10)
        assert r.status_code == 404

    def test_patch_booking_status_success_and_persist(self, session, admin_token):
        bid = self._create_booking(session)
        r = session.patch(f"{API}/admin/bookings/{bid}/status",
                          json={"status": "converted"}, headers=self._h(admin_token), timeout=10)
        assert r.status_code == 200
        assert r.json()["status"] == "converted"
        lst = session.get(f"{API}/admin/bookings", headers=self._h(admin_token), timeout=10).json()
        row = next((x for x in lst if x["id"] == bid), None)
        assert row is not None and row["status"] == "converted"
