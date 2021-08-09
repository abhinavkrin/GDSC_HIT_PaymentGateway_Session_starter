var model = (function(){
    var state = {
        products: [],
        memes: [],
        cartProduct: null
    };
    return {
        setProducts: function(products){
            state.products = products;
        },
        getAllProducts: function(){
            return state.products;
        },
        setMemes: function(meme){
            state.memes = meme;
        },
        getAllMemes: function(name){
            return state.memes;
        },
        setCartProduct: function(product){
            state.cartProduct = product;
        },
        getCartProduct: function(){
            return state.cartProduct;
        }
    }
})();

var view = (function(){
    return {
        showLoader: function(){
            document.getElementById("loader").innerHTML =`<div class="loader"></div>`
        },
        hideLoader: function(){
            document.getElementById("loader").innerHTML = ``;
        },
        showProducts: function(){
            var products = model.getAllProducts();
            var app = document.getElementById("app");
            var productsHtml = products.map(p => `
                <div class="product-card">
                    <div style="background: url(${p.data.image});" class="preview-img"></div>
                    <div class="product-name">${p.data.name}</div>
                    <div class="product-buy-btn">
                        <span>${p.data.price.currency} ${(p.data.price.amount/100).toFixed(2)}</span>
                        <a href="${'/checkout.html?productId='+p.id}">
                            <button>BUY</button>
                        </a>
                    </div>
                </div>
            `).join("");
            app.innerHTML = `
                <div class="products-grid">
                    ${productsHtml}
                </div>
            `;
        },
        showMyMemes: function(){
            var memeListHTML = model.getAllMemes().map(meme => {
                var memeURL = meme.data.product.image;
                var memeName = meme.data.product.name;
                return `
                    <div class="meme-card">
                        <img src="${memeURL}" alt="${memeName}" class="meme-img"/>
                        <div class="info-bar">
                            <div class="meme-name">${memeName}</div>
                            <a href="${memeURL}" download="${memeName.split('/').pop()}">
                                <button class="download-btn">SAVE</button>
                            </a>
                        </div>
                    </div>
                `;
            }).join("");
            document.getElementById("app").innerHTML = `
                <div class="meme-list">
                    ${memeListHTML || `<h3 style="padding: 4rem; text-align: center">No memes purchased till now.</h3>`}
                </div>
            `;
        },
        showCart: function(onCheckout){
            var product = model.getCartProduct();
            window.onCheckout =  function(e){
                if(onCheckout){
                    e.preventDefault();
                    var name = document.getElementById("billing-form-name").value;
                    var email = document.getElementById("billing-form-email").value;
                    var phone = document.getElementById("billing-form-phone").value;
                    onCheckout(name,email,phone);
                }
            };
            var billingFormHTML = `
                <div style="display: flex; justify-content: center; padding: 4rem 0.5rem">
                    <form onsubmit="onCheckout(event)">
                        <div class="form-control"><h3>Billing Details</h3></div>
                        <div class="form-control" style="display: flex; justify-content: space-between;">
                            <span>Product: </span>                                
                            <span>${product.data.name}</span>
                        </div>
                        <div class="form-control" style="display: flex; justify-content: space-between;">
                            <span>Price: </span>
                            <span>${product.data.price.currency} ${(product.data.price.amount/100).toFixed(2)}</span>
                        </div>
                        <div class="form-control">
                            <input type="text" placeholder="Full Name" id="billing-form-name"/>
                        </div>
                        <div class="form-control">
                            <input type="text" placeholder="Email" id="billing-form-email"/>
                        </div>
                        <div class="form-control">
                            <input type="text" placeholder="Phone" id="billing-form-phone"/>
                        </div>
                        <div class="form-control">
                            <button type="submit">Checkout</button>
                        </div>
                    </form>
                </div>
            `;
            document.getElementById("app").innerHTML = billingFormHTML;
        },
        showPaymentSuccess: function({razorpay_order_id,razorpay_payment_id}){
            document.getElementById("app").innerHTML = `
                <div style="padding: 4rem 0.5rem; text-align: center;">
                    <h3>Order Successfull</h3>
                    <div style="display: inline-grid; column-gap: 0.5rem; row-gap: 0.5rem; grid-template-columns: repeat(2,auto);">
                        <strong>Order ID: </strong>
                        <div>${razorpay_order_id}</div>
                        <strong>Payment Id: </strong>
                        <div>${razorpay_payment_id}</div>
                    </div>
                    <p style="padding: 0.5rem; max-width: 500px; widht: 100%; margin: auto;">
                        We have received your order. It may take a few minutes to process your order. Go to <a href="/my-memes.html">my memes.</a>
                    </p>
                </div>
            `
        }
    }
})();