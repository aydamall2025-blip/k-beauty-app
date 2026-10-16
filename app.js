const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}

const SUPABASE_URL = "https://unuzteqocuplezjkgokv.supabase.co/rest/v1/"; 
const SUPABASE_ANON_KEY = "sb_publishable_LQEx9ZCNUSeFe5K4mLFUfw_vNKDX6PW";

let cart = [];

function openAIConsultant() {
    const section = document.getElementById('ai-section');
    section.classList.toggle('hidden');
}

async function runAIConsultation() {
    const skinType = document.getElementById('skin-type').value;
    const skinConcern = document.getElementById('skin-concern').value;
    const resultDiv = document.getElementById('ai-result');

    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = "⏳ ИИ анализирует подбор ухода...";

    const recommendationText = `Для типа кожи (${skinType}) и решения проблемы (${skinConcern}) рекомендуется комплексный уход: Очищение + Сыворотка с активными компонентами + Увлажнение.`;

    resultDiv.innerHTML = `
        <div class="bg-white p-3 rounded-xl border border-pink-200 mt-2">
            <p class="font-bold text-pink-800 mb-1">💡 Рекомендация ИИ:</p>
            <p class="text-slate-600 mb-2">${recommendationText}</p>
            <span class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Результат сохранен в датасет</span>
        </div>
    `;

    try {
        await fetch(`${SUPABASE_URL}/rest/v1/ai_consultations`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                telegram_user_id: tg?.initDataUnsafe?.user?.id || 123456,
                user_skin_data: { skin_type: skinType, concern: skinConcern },
                ai_recommendation: recommendationText
            })
        });
    } catch (e) {
        console.error("Ошибка сохранения в БД:", e);
    }
}

function addToCart(title, price) {
    cart.push({ title, price });
    updateCartUI();
}

function updateCartUI() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-total').innerText = `${total.toLocaleString()} ₩ / сум`;
}

function checkout() {
    if (cart.length === 0) {
        alert("Корзина пуста!");
        return;
    }
    
    if (tg) {
        tg.sendData(JSON.stringify({
            action: "create_order",
            items: cart,
            total: cart.reduce((sum, item) => sum + item.price, 0)
        }));
    } else {
        alert("Заказ сформирован!");
    }
}
  
