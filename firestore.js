import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, updateDoc, arrayUnion, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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

export async function adicionarRemedioFirestore(userId, diaNome, remedioData) {
    try {
        console.log("Iniciando adição ao Firestore");
        const docRef = doc(db, "medidoso", userId, "agenda", diaNome);
        console.log("Referência do documento obtida:", docRef.path);

        const docSnap = await getDoc(docRef);
        console.log("Documento existe?", docSnap.exists());

        if (!docSnap.exists()) {
            console.log("Criando novo documento");
            await setDoc(docRef, { medicamentos: [remedioData] });
            console.log("Documento criado");
        } else {
            console.log("Atualizando medicamentos");
            await updateDoc(docRef, {
                medicamentos: arrayUnion(remedioData)
            });
            console.log("Documento atualizado com novo remédio");
        }
    } catch (error) {
        console.error("Erro ao adicionar remédio no Firestore:", error);
    }
}

export async function carregarRemediosFirestore(userId) {
    const agendaRef = collection(db, "medidoso", userId, "agenda");

    try {
        const querySnapshot = await getDocs(agendaRef);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const diaNome = doc.id;
                const remedios = doc.data().medicamentos;

                const lista = document.getElementById(`lista-${diaNome}`);
                
                if (remedios && lista) {
                    remedios.forEach(remedio => {
                        const li = document.createElement('li');

                        const horarioIcon = document.createElement('span');
                        horarioIcon.innerHTML = `<i class="fas fa-clock"></i> ${remedio.horario} - `;

                        const remedioIcon = document.createElement('span');
                        remedioIcon.innerHTML = `<i class="fas fa-pills"></i> ${remedio.nome} `;

                        li.appendChild(horarioIcon);
                        li.appendChild(remedioIcon);

                        if (remedio.observacoes) {
                            const observacaoIcon = document.createElement('div');
                            observacaoIcon.innerHTML = `<i class="fas fa-sticky-note"></i> ${remedio.observacoes}`;
                            li.appendChild(observacaoIcon);
                        }

                        li.dataset.horario = remedio.horario;

                        if (remedio.imagem) {
                            const img = document.createElement('img');
                            img.src = remedio.imagem;
                            img.className = 'img-preview';
                            img.style.maxWidth = '50px';
                            img.style.marginLeft = '10px';
                            li.appendChild(img);
                        }

                        const removeButton = document.createElement('button');
                        removeButton.textContent = '−';
                        removeButton.className = 'remove-button';
                        removeButton.onclick = async function(event) {
                            event.stopPropagation();
                            lista.removeChild(li);
                            await removerRemedioFirestore(userId, diaNome, remedio.horario, remedio.nome);
                        };
                        li.appendChild(removeButton);

                        lista.appendChild(li);

                        const itens = Array.from(lista.children);
                        itens.sort((a, b) => a.dataset.horario.localeCompare(b.dataset.horario));

                        lista.innerHTML = '';
                        itens.forEach(item => lista.appendChild(item));
                    });
                }
            });
        } else {
            console.log("Agenda não encontrada");
        }
    } catch (error) {
        console.error("Erro ao carregar os remédios do Firestore:", error);
    }
}

export async function removerRemedioFirestore(userId, diaNome, horario, nomeRemedio) {
    try {
        console.log("Removendo remédio do Firestore");

        const docRef = doc(db, "medidoso", userId, "agenda", diaNome);
        
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const agenda = docSnap.data();
            const medicamentos = agenda.medicamentos || [];

            const novosMedicamentos = medicamentos.filter(remedio => 
                !(remedio.horario === horario && remedio.nome === nomeRemedio)
            );

            if (novosMedicamentos.length !== medicamentos.length) {
                await updateDoc(docRef, {
                    medicamentos: novosMedicamentos
                });

                const updatedDocSnap = await getDoc(docRef);
                if (updatedDocSnap.exists()) {
                    console.log("Documento após remoção:", updatedDocSnap.data());
                }

                console.log(`Remédio ${nomeRemedio} removido com sucesso do dia ${diaNome}`);
            } else {
                console.log(`Nenhum remédio encontrado para remover com o horário ${horario} e nome ${nomeRemedio}`);
            }
        } else {
            console.log(`Documento do dia ${diaNome} não encontrado no Firestore`);
        }
    } catch (error) {
        console.error("Erro ao remover remédio no Firestore:", error);
    }
}