import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the send email API to always succeed
        await page.route('/api/auth/register/send', async (route) => {
            await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
        });

        // Mock the verification/register API to always succeed
        await page.route('/api/auth/register', async (route) => {
            await route.fulfill({ status: 200, body: JSON.stringify({ success: true, redirectTo: '/' }) });
        });

        // Mock the login API that is called after registration
        await page.route('/api/auth/login', async (route) => {
            await route.fulfill({ status: 200, body: JSON.stringify({ success: true, redirectTo: '/' }) });
        });

        await page.goto('/register');
    });

    test('should validate username rules', async ({ page }) => {
        const usernameInput = page.getByLabel(/Username|用户名/);
        const emailInput = page.getByLabel(/Email|邮箱/);
        const passwordInput = page.getByLabel(/^Password|密码$/);
        const confirmPasswordInput = page.getByLabel(/Confirm Password|确认密码/);
        const nextButton = page.getByRole('button', { name: /Next|下一步|获取验证码/ });

        // Helper to fill form and check for error
        const attemptRegistration = async (username: string) => {
            await usernameInput.fill(username);
            await nextButton.click();
        };

        // 1. Starts with digit
        await attemptRegistration('1abc');
        await expect(page.getByText(/Invalid Name|用户名格式不正确/)).toBeVisible();

        // 2. Too short
        await attemptRegistration('abc');
        await expect(page.getByText(/Invalid Name|用户名格式不正确/)).toBeVisible();

        // 3. Special characters
        await attemptRegistration('user@name');
        await expect(page.getByText(/Invalid Name|用户名格式不正确/)).toBeVisible();

        // 4. Valid username - should NOT show error (but will fail on other fields if empty, so we just check user field validation logic primarily)
        // To strictly check if it proceeds, we need to fill other fields
        await usernameInput.fill('ValidUser1');
        await emailInput.fill('test@example.com');
        await passwordInput.fill('Password123!');
        await confirmPasswordInput.fill('Password123!');
        await page.getByRole('checkbox').check();

        // Clear any previous errors
        // Click Next
        await nextButton.click();

        // Expect transition to Step 2 (Verification code input should appear)
        await expect(page.locator('input[inputmode="numeric"]')).toHaveCount(6);
    });

    test('should auto-submit after entering 6-digit code', async ({ page }) => {
        // Fill Step 1
        await page.getByLabel(/Username|用户名/).fill('AutoSubmitUser');
        await page.getByLabel(/Email|邮箱/).fill('test@example.com');
        await page.getByLabel(/^Password|密码$/).fill('Password123!');
        await page.getByLabel(/Confirm Password|确认密码/).fill('Password123!');
        await page.getByRole('checkbox').check();
        await page.getByRole('button', { name: /Next|下一步|获取验证码/ }).click();

        // Wait for Step 2
        const codeInputs = page.locator('input[inputmode="numeric"]');
        await expect(codeInputs).toHaveCount(6);

        // Enter code digits 1-6 slowly
        const code = '123456';
        for (let i = 0; i < code.length; i++) {
            await codeInputs.nth(i).type(code[i], { delay: 100 });
        }

        // Verify auto-submit triggered
        // The button should show loading state or we should be redirected
        // Since we mocked success, we expect redirect or success message
        // Updating checking logic based on UI behavior
        await expect(page.getByRole('button', { name: /Completing|完成中/ })).toBeVisible();

        // Eventually should redirect or show success
        // If redirection happens within the test context, page URL should change or success alert appears
        // await expect(page).toHaveURL('/'); // Uncomment if verification of redirect is strictly needed and works with the mock
    });
});
