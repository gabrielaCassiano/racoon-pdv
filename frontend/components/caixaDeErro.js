export class CaixaDeErro {
    constructor(content) {
        this.content = content;
        this.box = document.createElement('div');
        this.boxTurn = document.createElement('div');
        this.boxTurn.style.rotate = '45deg'
        this.boxTurn.style.display = 'block'
        this.boxTurn.style.backgroundColor = '#fff2f4'
        this.boxTurn.style.borderLeft  = '1px solid red'
        this.boxTurn.style.borderTop = '1px solid red'
        this.boxTurn.style.width = '10px'
        this.boxTurn.style.height = '10px'
 
        this.boxTurn.style.zIndex = '1000000'
        this.boxTurn.style.position = 'absolute'
        this.boxTurn.style.top = '-0.4em'
        this.boxTurn.style.left = '4.5em'

        this.box.style.zIndex = '10000'
        this.box.className = 'caixa-de-erro';
        this.box.innerHTML = content;
        this.box.style.position = 'absolute';
        this.box.style.display = 'none';
        this.box.style.border = '1px solid red'
        this.box.style.width = '10em'
        this.box.style.borderRadius = '12px'
        this.box.style.backgroundColor = 'white'
        this.box.style.textAlign = 'center'
        this.box.style.color = 'red'

        this.box.appendChild(this.boxTurn)

        document.addEventListener('click', (e) => {
            if (this.box.style.display === 'block' && !this.box.contains(e.target)) {
                this.hide();
            }
        });

    }

    show(targetElement) {

        const parentElement = targetElement.parentElement;
        parentElement.style.position = 'relative';

        if (!parentElement.contains(this.box)) {
            parentElement.appendChild(this.box);
        }
        
        const rect = targetElement.getBoundingClientRect();
        this.box.style.left = '50%';
        this.box.style.transform = 'translateX(-50%)';
        this.box.style.top = `${rect.height + 20}px`; 
        this.box.style.display = 'block';
    }

    hide() {
        this.box.style.display = 'none';
    }
}
