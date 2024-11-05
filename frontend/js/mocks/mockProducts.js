export function mockFetch(url, options = {}) {
    return new Promise((resolve) => {
        let products = [
            {id: 1, name: "Coca-Cola 2L Tradicional", preco: "12,99"},
            {id: 7894900700015, name: "Coca-Cola Lata 350ml Zero", qtd: "1", preco: "4,99"},
        ];

        const productIdMatch = url.match(/\/api\/products\/(\d+)/);

        if(url === '/api/products' && options.method === 'GET') {
            setTimeout(() => {
                resolve({
                    json: () => Promise.resolve(products), 
                    status: 200
                })
            }, 500);
        } else if (productIdMatch && options.method === 'GET') {
            const productId = parseInt(productIdMatch[1])
            const product = products.find(p => p.id === productId)
            setTimeout(() => {
                if (product) {
                    resolve({
                        json: () => Promise.resolve(product), 
                        status: 200
                    })
                } else {
                    resolve({
                        json: () => Promise.resolve({ message: "Produto Não Encontrado!!!!!"}),
                        status: 404
                    })
                }
            }, 500);
        } else {
            setTimeout(() => {
                resolve({
                    json: () => Promise.resolve({ message: "Endpoint Não Encontrado!!!!!"}),
                    status: 404
                })
            }, 500);
        }
    })
}