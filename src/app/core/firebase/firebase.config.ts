import { initializeApp } from 'firebase/app'; //Importo la función para inicializar la aplicación de Firebase
import { getAuth } from 'firebase/auth'; //Importo la función para obtener la instancia de autenticación de Firebase
import { getFirestore } from 'firebase/firestore'; //Importo la función para obtener la instancia de Firestore
import { environment } from '../../../environments/environment'; //Importo el objeto de configuración de Firebase desde el archivo de entorno

const app = initializeApp(environment.firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
