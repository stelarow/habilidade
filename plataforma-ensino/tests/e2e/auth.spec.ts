import { test, expect } from '@playwright/test';

function randomEmail() {
  return `user_${Date.now()}@example.com`;
}

const password = 'Test1234';

// Registro e login completo
test('fluxo de registro, logout e login', async ({ page }) => {
  const email = randomEmail();

  // Registro
  await page.goto('/auth/register');
  await page.getByLabel('Nome completo').fill('Usuário Teste');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(password);
  await page.getByLabel('Confirmar senha').fill(password);
  await page.locator('#terms').check();
  await page.getByRole('button', { name: 'Criar conta' }).click();

  // Aguarda término do estado de carregamento
  await page.waitForSelector('text=Criando conta...', { state: 'detached', timeout: 15000 });

  // Navega para a página de login
  await page.goto('/auth/login');

  // Login
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Entrar' }).click();

  // Deve redirecionar ao dashboard
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await expect(page).toHaveURL('/dashboard');

  // Logout
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL('/auth/login');
});

// Recuperação de senha (apenas valida UI)
test('fluxo de recuperação de senha', async ({ page }) => {
  await page.goto('/auth/forgot-password');
  await page.getByLabel('Email').fill('dummy@example.com');
  await page.getByRole('button', { name: 'Enviar link de recuperação' }).click();
  await expect(page.getByText('Email enviado!')).toBeVisible();
}); 