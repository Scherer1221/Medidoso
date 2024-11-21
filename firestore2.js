import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCMQtt7KP30AcHi72FHtaZtZOXIYL7DVv0",
    authDomain: "medidoso.firebaseapp.com",
    databaseURL: "https://medidoso-default-rtdb.firebaseio.com",
    projectId: "medidoso",
    storageBucket: "medidoso.appspot.com",
    messagingSenderId: "1006734497522",
    appId: "1:1006734497522:web:98f5911a09c35146bb626b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function adicionarRemedioFirestore(uid, dia, remedioData) {
    const docRef = doc(db, "medidoso", uid, "agenda", dia);
    
    // Verifica se o documento já existe
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
        // Se não existir, cria o documento com uma estrutura inicial
        await setDoc(docRef, { medicamentos: [] }); // Inicializa a lista de medicamentos como um array vazio
    }
    
    // Agora, atualiza o documento para adicionar o remédio
    await updateDoc(docRef, {
        medicamentos: arrayUnion(remedioData) // Usa arrayUnion importado
    });
}