import random
from locust import HttpUser, task, between, events

class PersonaIQUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self):
        """Simulates user sign-in and token acquisition before running workload tasks."""
        self.token = None
        user_email = f"loadtest_{random.randint(1000, 9999)}@example.com"
        
        # 1. Sign Up
        signup_res = self.client.post(
            "/api/v1/auth/sign-up",
            json={
                "email": user_email,
                "password": "Password123!",
                "first_name": "LoadTest",
                "last_name": "User",
            },
            name="/api/v1/auth/sign-up",
        )
        if signup_res.status_code in (200, 201):
            json_data = signup_res.json()
            if "data" in json_data and "access_token" in json_data["data"]:
                self.token = json_data["data"]["access_token"]
                self.client.headers.update({"Authorization": f"Bearer {self.token}"})

    @task(3)
    def fetch_dashboard(self):
        """Simulates polling the executive dashboard."""
        self.client.get("/api/v1/dashboard/overview", name="/api/v1/dashboard/overview")

    @task(2)
    def fetch_wardrobe(self):
        """Simulates fetching user wardrobe items."""
        self.client.get("/api/v1/wardrobe", name="/api/v1/wardrobe")

    @task(1)
    def fetch_health(self):
        """Simulates readiness probe checks."""
        self.client.get("/api/v1/health", name="/api/v1/health")
