const SUPABASE_URL = "https://ujrvxygujfbfpkltqdrr.supabase.co";
const SUPABASE_KEY = "sb_publishable_qSeLfUFNqA5ajhto8rJAYw_tbBfDjJl";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let signUpMode = false;


/* -------------------------
   AUTHENTICATION
------------------------- */

async function authenticate() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("auth-message");

    if (!email || !password) {

        message.textContent =
            "Please enter your email and password.";

        return;
    }


    if (signUpMode) {

        const { error } =
            await supabaseClient.auth.signUp({
                email,
                password
            });

        if (error) {

            message.textContent = error.message;

            return;
        }

        message.textContent =
            "Account created! Check your email if verification is required.";

    } else {

        const { error } =
            await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

        if (error) {

            message.textContent = error.message;

            return;
        }

        await loadApp();
    }
}


function toggleAuthMode() {

    signUpMode = !signUpMode;

    document.getElementById("auth-title").textContent =
        signUpMode
            ? "Create your Nova AI account"
            : "Welcome to Nova AI";

    document.getElementById("auth-subtitle").textContent =
        signUpMode
            ? "Create a free account"
            : "Sign in to continue";

    document.getElementById("auth-button").textContent =
        signUpMode
            ? "Create Account"
            : "Sign In";

    document.getElementById("switch-button").textContent =
        signUpMode
            ? "Already have an account? Sign in"
            : "Create an account";
}


/* -------------------------
   LOAD APP
------------------------- */

async function loadApp() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {

        document.getElementById("auth-screen").style.display =
            "flex";

        document.getElementById("app").style.display =
            "none";

        return;
    }

    document.getElementById("auth-screen").style.display =
        "none";

    document.getElementById("app").style.display =
        "flex";


    await loadProfile();
}


async function loadProfile() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) return;


    const { data: profile } =
        await supabaseClient
            .from("profiles")
            .select("role, plan")
            .eq("id", user.id)
            .single();


    if (profile) {

        const plan =
            document.getElementById("plan");

        plan.textContent =
            profile.role === "owner"
                ? "OWNER 👑"
                : profile.plan.toUpperCase();

    }
}


/* -------------------------
   CHAT
------------------------- */

function sendMessage() {

    const input =
        document.getElementById("message");

    const message =
        input.value.trim();

    if (!message) return;

    document.getElementById("welcome")?.remove();

    addMessage(message, "user");

    input.value = "";


    setTimeout(() => {

        addMessage(
            "Your Nova AI account is working. The real AI model will be connected next.",
            "ai"
        );

    }, 500);
}


function addMessage(text, type) {

    const chatArea =
        document.getElementById("chat-area");

    const message =
        document.createElement("div");

    message.className = "message";


    if (type === "user") {

        message.innerHTML = `
            <div class="user-message">
                ${escapeHTML(text)}
            </div>
        `;

    } else {

        message.innerHTML = `
            <div class="ai-message">
                <strong>Nova AI</strong>
                <p>${escapeHTML(text)}</p>
            </div>
        `;
    }


    chatArea.appendChild(message);

    chatArea.scrollTop =
        chatArea.scrollHeight;
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


function handleKey(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();
    }
}


function useSuggestion(text) {

    const input =
        document.getElementById("message");

    input.value = text;

    input.focus();
}


function newChat() {

    document.getElementById("chat-area").innerHTML = `
        <div class="welcome" id="welcome">

            <h1>What can I help you create?</h1>

            <p>Ask Nova AI anything.</p>

        </div>
    `;
}


/* -------------------------
   OTHER BUTTONS
------------------------- */

function openSettings() {

    alert("Settings coming soon.");

}


function upgrade() {

    alert("Paid plans coming soon.");

}


async function logout() {

    await supabaseClient.auth.signOut();

    location.reload();
}


/* -------------------------
   START
------------------------- */

loadApp();
