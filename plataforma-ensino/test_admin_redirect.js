const puppeteer = require('puppeteer');

async function testAdminLogin() {
    // Set DISPLAY environment variable for X server
    process.env.DISPLAY = ':0';
    
    console.log('Starting admin login test...');
    
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ],
            env: {
                ...process.env,
                DISPLAY: ':0'
            }
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        
        // Enable console logging from the page
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('request', req => console.log('REQUEST:', req.url()));
        page.on('response', res => console.log('RESPONSE:', res.url(), res.status()));
        
        console.log('1. Navigating to login page...');
        await page.goto('https://plataformahabilidade.netlify.app/auth/login', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        await page.screenshot({ path: 'step1_login_page.png' });
        console.log('Screenshot: step1_login_page.png');
        
        console.log('2. Filling login form...');
        await page.type('input[type="email"]', 'alessandrobatisp@gmail.com');
        await page.type('input[type="password"]', '$Stelarow123');
        
        await page.screenshot({ path: 'step2_form_filled.png' });
        console.log('Screenshot: step2_form_filled.png');
        
        console.log('3. Clicking login button...');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }),
            page.click('button[type="submit"]')
        ]);
        
        await page.screenshot({ path: 'step3_after_login.png' });
        console.log('Screenshot: step3_after_login.png');
        console.log('Current URL after login:', page.url());
        
        // Check if we're redirected to admin
        if (page.url().includes('/admin')) {
            console.log('✅ Successfully redirected to admin panel');
            
            console.log('4. Testing admin functionality...');
            // Try to access enrollments page
            await page.goto('https://plataformahabilidade.netlify.app/admin/enrollments', {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            
            await page.screenshot({ path: 'step4_enrollments_page.png' });
            console.log('Screenshot: step4_enrollments_page.png');
            console.log('Current URL on enrollments:', page.url());
            
            // Check if enrollments are visible
            const enrollmentsCount = await page.evaluate(() => {
                const rows = document.querySelectorAll('tbody tr');
                return rows.length;
            });
            
            console.log('Enrollments found:', enrollmentsCount);
            
            if (enrollmentsCount === 0) {
                console.log('⚠️  No enrollments visible - checking for error messages');
                const errorText = await page.evaluate(() => {
                    const errorElement = document.querySelector('.text-red-400');
                    return errorElement ? errorElement.textContent : null;
                });
                if (errorText) {
                    console.log('Error message found:', errorText);
                }
            } else {
                console.log('✅ Enrollments are visible');
            }
            
        } else if (page.url().includes('/dashboard')) {
            console.log('⚠️  Redirected to user dashboard instead of admin');
        } else if (page.url().includes('/auth/login')) {
            console.log('❌ Still on login page - possible redirect loop');
        } else {
            console.log('❓ Unexpected redirect to:', page.url());
        }
        
        console.log('Test completed. Browser will stay open for manual inspection.');
        console.log('Press Ctrl+C to close when done.');
        
        // Keep browser open for manual testing
        await new Promise(() => {});
        
    } catch (error) {
        console.error('Error during test:', error);
    }
}

testAdminLogin();