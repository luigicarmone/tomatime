# TOMATIME BACKEND

Questo progetto implementa l'API che l'applicazione React utilizzerà per ricevere 
i dati di cui necessita per funzionare

## Installate Docker

Per funzionare, l'applicazione necessita di un server [MongoDB](https://www.mongodb.com/).
Invece di installare manualmente MongoDB, utilizzeremo Docker quindi prima di iniziare
installate [Docker Desktop](https://www.docker.com/products/docker-desktop/).

Se non desiderate installare Docker è disponibile un installer guidato di MongoDB sia per il sistema operativo Windows che per MacOS.

### Creare un istanza MongoDB

Se l'installazione di Docker è andata a buon fine potete installare MongoDB con il seguente comando:

```
$ docker run --name tomatime -p 27017:27017 -d mongo:4.4.10
```

Questo comando crea un'immagine Docker e la esegue in locale sulla vostra macchina. Il server mongo DB sarà disponibile all'indirizzo `mongodb://localhost:27017`.

Per visualizzare i dati delle vostre collection basta installare un client per MongoDB. Ce ne sono tantissimi il più famoso e gratuito è [Robo 3T](https://robomongo.org/).

## Script disponibili

Nel file `package.json` sono stati definiti alcuni script utili allo sviluppo:

### `npm run mongo`

Avvia un server MongoDB in locale utilizzando Docker. È importate eseguire questo comando prima di qualsiasi altro. Nel caso in cui non lo fate il server non verrà avviato a causa di un errore.

### `npm run dev`

Avvia il server in modalità sviluppo sulla porta `9001`
Navigate su [http://localhost:9001](http://localhost:9001) per verificare che tutto sia up.

### `npm start`

Questo comando avvia il server in modalità produzione

### `npm run test`

Esegue i test in locale. In questa fase non utilizzeremo questo comando.

## Ricordatevi della documentazione

Per avere maggiori informazioni su fastify non dimenticate mai di dare uno sguardo alla [documentazione ufficiale](https://www.fastify.io/docs/latest/)
o a tutti gli esempi riportati nel capitolo 12 del progetto [Habeetat Node.js](https://github.com/webeetle/habeetat-nodejs)

## L'autenticazione

I metodi di registrazione ed autenticazione sono già stati implementati per voi. Visto che non vi verrà richiesto di gestire la registrazione dall'applicazione, dovrete crearla manualmente. Per farlo basta inviare una richiesta `POST` all'indirizzo `http://localhost:9001` con il seguente corpo:

```
{
  "username": "<username>",
  "password": "<password>",
  "fullName": "<nome completo>
}
```

Se tutto è andato a buon fine potete invocare l'URL `http://localhost:9001/signin` e utilizzareil token per effettuare le successive richieste alle rotte private che dovrete implementare.

## Rotte pubbliche e private

In questo progetto sono state definite le rotte pubbliche, ossia quelle che non necessitano di un'autenticazione implementate nella directory `public`, come `/signup` e `/signin` e quelle private, che implementerete voi nella directory `private` e che avranno un prefisso `/api`.

Per complendere meglio il funzionamento date uno sguardo ai file `app.js` e `plugins/jwt.js`.
