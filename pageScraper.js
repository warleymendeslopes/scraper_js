const scraperObject = {
    url: 'https://www.bioage.com.br/homecare',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);


        // Aguarde a renderização do DOM necessário
		await page.waitForSelector('.categories.box');
		// Obtenha o link para todos os livros necessários
		let urls = await page.$$eval('.card-item .product-image', links => {
			// Verifique se o livro a ser raspado está em estoque
			    //links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
			//Extraia os links dos dados
			links = links.map(el => el.querySelector(' a').href)
			return links;
		});
		console.log(urls);

        //Percorra cada um desses links, abra uma nova instância de página e obtenha os dados relevantes deles

		let pagePromise = (link) => new Promise(async(resolve, reject) => {
			let dataObj = {};
			let newPage = await browser.newPage();
			await newPage.goto(link);

			dataObj['bookTitle'] = await newPage.$eval('.col-12.col-md-7.col-lg-6.product-info h1', text => text.textContent);
            dataObj['imageUrl'] = await newPage.$eval('.image-zoom > img', img => img.src);
			dataObj['bookPrice'] = await newPage.$eval('.product-price', text => text.textContent);
			dataObj['bookdesc'] = await newPage.$eval('.product-description', text => text.textContent);
            



			
            resolve(dataObj);
			await newPage.close();
		});

		for(link in urls){
			let currentPageData = await pagePromise(urls[link]);
			// scrapedData.push(currentPageData);
			console.log(currentPageData);
		}









    }
}

module.exports = scraperObject;


 