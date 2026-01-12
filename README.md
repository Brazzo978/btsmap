# btsmap

Applicazione web che consente agli utenti di segnalare la posizione di una BTS tramite una mappa interattiva.

## Requisiti

- [Node.js](https://nodejs.org/) (versione 18 o successiva) e npm
- Un browser moderno per l'interfaccia utente

## Installazione

1. Clonare il repository:
   ```bash
   git clone https://github.com/Brazzo978/btsmap
   cd eolobtsmap
   ```
2. Installare le dipendenze del backend:
   ```bash
   cd backend
   npm install
   ```

## Primo avvio

1. Avviare il server backend:
   ```bash
   npm start
   ```
   Il server sarà raggiungibile su `http://localhost:3000`.
2. Aprire `frontend/index.html` in un browser per utilizzare l'applicazione.

## Personalizzazioni

- Per cambiare la porta del server è possibile usare la variabile d'ambiente `PORT`.
- Impostare `UPLOADS_DIR` per specificare la cartella in cui salvare le immagini (di default `/opt/media`).
- Impostare `DB_DIR` per specificare una cartella esterna in cui salvare il database SQLite (di default `/opt/database`).

## Configurazione del client email

Per inviare le email di registrazione e di recupero della password il backend usa [Nodemailer](https://nodemailer.com/) con un account Gmail.
Prima di avviare il server è necessario impostare le credenziali SMTP attraverso le variabili d'ambiente:

```bash
export SMTP_USER="tuoaccount@gmail.com"
export SMTP_PASS="tua-app-password"
export ADMIN_EMAIL="indirizzo_admin@example.com"
```

`SMTP_USER` e `SMTP_PASS` devono contenere rispettivamente l'indirizzo e la password (o [Password per le app](https://support.google.com/accounts/answer/185833)) dell'account utilizzato per l'invio delle mail.
`ADMIN_EMAIL` definisce l'indirizzo associato all'utente amministratore creato al primo avvio.


## Struttura del progetto

- `backend/` – API e server Express con SQLite.
- `frontend/` – interfaccia utente basata su Leaflet.

## Importazione da file AGCOM

Per importare marker da un file Excel scaricato dal sito AGCOM è disponibile lo script:

```bash
cd backend
 npm run import-agcom -- path/to/file.xlsx
```

 Lo script converte automaticamente le coordinate "LAT." e "LONG." in gradi decimali, salva l'"Ubicazione" nel campo `localita`, il "Bouquet" nella `descrizione` e la "FREQ. CENTRALE/PORTANTE" nel campo `frequenze`, assegnando il tag `Radio` per i tipi *FM* e *RD* oppure `TV` per i tipi *TD*. Se più righe presentano la stessa latitudine, longitudine e ubicazione, i relativi dettagli vengono uniti in un unico marker.

## Funzionalità Admin

Gli utenti con ruolo *admin* possono attivare la **Modalità unione** dalla pagina principale e selezionare più marker vicini. I marker scelti vengono fusi in uno solo, combinando descrizioni, tag, frequenze e immagini dei marker originali.

## Unione automatica di marker vicini

Per accorpare tutti i marker entro una distanza specifica è disponibile lo script:

```bash
cd backend
npm run merge-nearby -- <distanza-in-metri>
```

Al termine dell'esecuzione verrà mostrato il numero totale di marker uniti.
