# TOMATIME APP

## Installate Docker

Per funzionare, l'applicazione necessita di un server [MongoDB](https://www.mongodb.com/).
Invece di installare manualmente MongoDB, utilizzeremo Docker quindi prima di iniziare
installate [Docker Desktop](https://www.docker.com/products/docker-desktop/).

Se non desiderate installare Docker è disponibile un installer guidato di MongoDB sia per il sistema operativo Windows che per MacOS.

### Creare un istanza MongoDB

Se l'installazione di Docker è andata a buon fine potete installare MongoDB con il seguente comando:

```
$ docker run -p 27017:27017 -d mongo:4.4.10
```

Questo comando crea un'immagine Docker e la esegue in locale sulla vostra macchina. Il server mongo DB sarà disponibile all'indirizzo `mongodb://localhost:27017`.

Per visualizzare i dati delle vostre collection basta installare un client per MongoDB. Ce ne sono tantissimi il più famoso e gratuito è [Robo 3T](https://robomongo.org/).

## I file README

Nelle applicazioni di backend e frontend troverete tutte le informazioni necessarie all'utilizzo del progetto nei rispettivi file `README`.

## Installare le dipendenze

Per installare tutte le dipendenze necessarie (sia per il backend che per il frontend) eseguite il comando:

```
$ npm run install
```

## Eseguire le applicazioni

Esattamente come per l'installazione esiste un unico comando per eseguire le applicazioni

```
$ npm start
```