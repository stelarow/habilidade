const puppeteer = require('puppeteer');

async function testPuppeteerGraphical() {
    // Set DISPLAY environment variable for X server
    process.env.DISPLAY = ':0';
    
    console.log('DISPLAY:', process.env.DISPLAY);
    console.log('Starting Puppeteer in graphical mode...');
    
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu-sandbox'
            ],
            env: {
                ...process.env,
                DISPLAY: ':0'
            }
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 });
        
        console.log('Navigating to admin login...');
        await page.goto('https://plataformahabilidade.netlify.app/auth/login');
        
        // Take screenshot to verify it's working
        await page.screenshot({ path: 'admin_login_test.png' });
        console.log('Screenshot saved as admin_login_test.png');
        
        // Keep browser open for visual testing
        console.log('Browser opened - keeping it running for manual testing...');
        console.log('Press Ctrl+C to close when done testing');
        
        // Wait indefinitely until manually closed
        await new Promise(() => {});
        
    } catch (error) {
        console.error('Error launching Puppeteer:', error);
    }
}

testPuppeteerGraphical();