export class CaixaDeErro {
    constructor(content) {
        this.content = content;
        this.box = document.createElement('div');
        this.box.className = 'caixa-de-erro';
        this.box.innerHTML = content;
        this.box.style.position = 'absolute';
        this.box.style.display = 'none';
        this.box.style.border = '1px solid red'
        this.box.style.width = '10em'
        this.box.style.borderRadius = '12px'
        this.box.style.backgroundColor = '#fff2f4'
        this.box.style.textAlign = 'center'
        this.box.style.color = 'red'

    }

    show(targetElement) {
        if (!targetElement.parentElement.contains(this.box)) {
            targetElement.parentElement.appendChild(this.box);
        }
        
        const rect = targetElement.getBoundingClientRect();
        this.box.style.left = `10px`;
        this.box.style.top = `${rect.height + 20}px`; 
        this.box.style.display = 'block';
    }

    hide() {
        this.box.style.display = 'none';
    }
}
