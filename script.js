document.addEventListener('DOMContentLoaded', () => {

    // ========== CONFIGURAÇÃO ==========
    // !! IMPORTANTE !!
    // Coloque aqui o seu número de WhatsApp com código do país e DDD
    // Exemplo: 5516982401873
    const SEU_NUMERO_DE_WHATSAPP = '5516982401873'; 
    // =================================

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const observationInput = document.getElementById('observacao');

    let cart = [];

    // Adiciona evento de clique para todos os botões "Adicionar ao Carrinho"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            addToCart(name, price);
        });
    });

    // Função para adicionar item ao carrinho
    function addToCart(name, price) {
        // Verifica se o item já existe no carrinho
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCartDisplay();
    }

    // Função para remover item do carrinho
    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        updateCartDisplay();
    }
    
    // Função para atualizar a exibição do carrinho
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            cartTotalElement.innerText = 'R$ 0,00';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        const ul = document.createElement('ul');
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>
                    <button class="remove-item-btn" data-name="${item.name}">X</button>
                    ${item.quantity}x ${item.name}
                </span>
                <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            `;
            ul.appendChild(li);
            total += item.price * item.quantity;
        });

        cartItemsContainer.appendChild(ul);
        cartTotalElement.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;

        // Adiciona evento de clique para os novos botões de remover
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const nameToRemove = e.target.getAttribute('data-name');
                removeFromCart(nameToRemove);
            });
        });
    }

    // Função para finalizar o pedido
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio! Adicione produtos antes de finalizar o pedido.');
            return;
        }

        if (!SEU_NUMERO_DE_WHATSAPP || SEU_NUMERO_DE_WHATSAPP === '5511999999999') {
            alert('Erro: Número de WhatsApp não configurado no arquivo script.js!');
            return;
        }

        // Monta a mensagem do pedido
        let message = 'Olá! 👋 Gostaria de fazer o seguinte pedido:\n\n';
        cart.forEach(item => {
            message += `*${item.quantity}x* - ${item.name}\n`;
        });

        const totalValue = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        message += `\n*Total:* R$ ${totalValue.toFixed(2).replace('.', ',')}\n`;

        const observation = observationInput.value.trim();
        if (observation) {
            message += `\n*Observações:* ${observation}\n`;
        }
        
        message += '\nObrigado(a)!';

        // Codifica a mensagem para URL e abre o WhatsApp
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${5516982401873}?text=${5516982401873}`;
        
        window.open(whatsappUrl, '_blank');
    });

});