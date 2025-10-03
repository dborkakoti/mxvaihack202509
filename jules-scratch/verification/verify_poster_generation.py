import re
import json
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Mock the registration API response
    def handle_register_route(route):
        mock_response = {
            "id": "mock_reg_12345",
            "name": "Test User",
            "email": "test@example.com",
            "phone": "1234567890",
            "branch": "Test Branch",
            "tshirt_size": "L",
            "dietary": "None"
        }
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps(mock_response)
        )

    page.route("**/api/register", handle_register_route)

    # Mock the poster generation API response
    def handle_poster_route(route):
        mock_response = {
            "success": True,
            "registrationRecord": {
                "id": "mock_reg_12345",
                "name": "Test User",
                "email": "test@example.com",
                "phone": "1234567890",
                "branch": "Test Branch",
                "tshirt_size": "L",
                "dietary": "None",
                "selfie_url": "/uploads/mock_selfie.png"
            }
        }
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps(mock_response)
        )

    page.route("**/api/poster/generate", handle_poster_route)

    # Mock the registration data polling API response
    def handle_get_registration_route(route):
        mock_response = {
            "id": "mock_reg_12345",
            "name": "Test User",
            "email": "test@example.com",
            "phone": "1234567890",
            "branch": "Test Branch",
            "tshirt_size": "L",
            "dietary": "None",
            "selfie_url": "/uploads/mock_selfie.png"
        }
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps(mock_response)
        )

    page.route("**/api/registration/*", handle_get_registration_route)

    # Go to registration page
    page.goto("http://localhost:3000/register")

    # Fill out the form
    page.get_by_label("Name").fill("Test User")
    page.get_by_label("Email").fill("test@example.com")
    page.get_by_label("Phone").fill("1234567890")
    page.get_by_label("Branch / Region").fill("Test Branch")
    page.get_by_label("T-shirt Size").select_option("L")
    page.get_by_label("Dietary Preferences").fill("None")

    # Submit the form
    page.get_by_role("button", name="Register").click()

    # Wait for successful registration toast
    expect(page.get_by_text("Registration successful!")).to_be_visible()

    # Navigate to the poster page
    page.goto("http://localhost:3000/poster")

    # Check for the main heading
    expect(page.get_by_role("heading", name="Generate Your Poster")).to_be_visible()

    # Upload the dummy image
    page.get_by_label("1. Upload Your Selfie").set_input_files("jules-scratch/verification/test-image.png")

    # Click the generate button
    page.get_by_role("button", name="Upload and Generate Poster").click()

    # Wait for the processing message to appear
    expect(page.get_by_text("Poster processing...")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/poster_generation_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)