
const allowedUsersStr = `sofiaparpi@gmail.com, fjferran@gcloud.ua.es, abadia@umh.es,jm.camara@umh.es,angel.carbonell@umh.es,lnoguera@umh.es,hpuerto@umh.es,sgarcia@umh.es,rocamora@umh.es,lmartinez@umh.es,spardo@umh.es,mbrugaro@umh.es,sgarcia@uhm.es,francisco.jimenezj@umh.es, f.aragon@umh.es, rsuay.iata@gmail.com, gbigatti@cenpat-conicet.gob.ar, bosco@cenpat-conicet.gob.ar, lozada.mari@gmail.com, laura.trujillo72@tdea.edu.co, veronica@cannabisjobs.eu, hedonistgrower@gmail.com, yerbasyhaze@gmail.com, rrcasa@gmail.com, hugvx89@hotmail.com, albatrosgaleano@gmail.com, samaniegoperezsaul@gmail.com, joseriosvsvella@icloud.com, fabinidc@gmail.com, r_basili@hotmail.com, ivanmartin82@hotmail.es, perellinaresborja@gmail.com, specialplant@gmail.com, franciscogarciacasado31@gmail.com, nico.canete.saviola92@gmail.com, lavidarandomdelasdeoia@gmail.com, hugouacanna@gmail.com, hondacrf450lacy@gmail.com, pedrocoves7@gmail.com, hugvx89@gmail.com, leyton.carlos@gmail.com, mateolajara1@gmail.com, eloyrose@gmail.com, sergi.b4113@gmail.com, lukestringer92@hotmail.com, kosherplusmusic@gmail.com, erikaang@gmail.com, alvaro.serrano.cp@gmail.com, ingeniera.anton19@gmail.com, rba.light@gmail.com`;

const allowedUsers = allowedUsersStr.split(",").map(e => e.trim().toLowerCase());

const imageEmails = [
    "fabinidc@gmail.com",
    "esclavo.del.terpeno1@gmail.com",
    "sergi.b4113@gmail.com",
    "hugouacanna@gmail.com",
    "yerbasyhaze@gmail.com",
    "albatrosgaleano@gmail.com",
    "aserranobenedid@gmail.com",
    "rrcasa@gmail.com",
    "hedonistgrower@gmail.com",
    "nico.canete.saviola92@gmail.com",
    "hondacrf450lacy@gmail.com",
    "perellinaresborja@gmail.com",
    "franciscogarciacasado31@gmail.com"
];

console.log("Checking permissions...");
const noPermission = imageEmails.filter(email => !allowedUsers.includes(email.toLowerCase()));

console.log("No permission:", noPermission);
