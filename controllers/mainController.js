const fs = require('fs')
const path = require('path')

/* Lista de Productos .JSON */
const allShoesFilePath = path.join (__dirname, '../data/productList.json')
const allShoes = JSON.parse(fs.readFileSync(allShoesFilePath, 'utf-8'))

const mainController = {
    index: (req, res) => { 
        res.render('index', { title: 'SPORT SHOES' });
    },
    
    error: (req, res) => {
        res.render('error');

    },
    
    terms: (req, res) => {
        res.render('terms');
        
    }
}


module.exports = mainController;


