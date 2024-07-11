CREATE TABLE boards (
    nom VARCHAR(255) PRIMARY KEY
);

ALTER TABLE notes ADD FOREIGN KEY (boardID) REFERENCES boards(nom);

CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_note INTEGER NOT NULL,
    commentaire VARCHAR(255),
    FOREIGN KEY (id_note) REFERENCES notes(id)
);
ALTER TABLE notes DROP COLUMN tag;

CREATE TABLE utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    pseudo VARCHAR(255) UNIQUE,
    nom VARCHAR(255),
    prenom VARCHAR(255),
    mail VARCHAR(255) UNIQUE,
    passwd VARCHAR(255),
    isRGPD BOOLEAN NOT NULL DEFAULT 0
);

ALTER TABLE notes ADD FOREIGN KEY (userID) REFERENCES utilisateurs(id) NOT NULL;
ALTER TABLE tags ADD FOREIGN KEY (userID) REFERENCES utilisateurs(id) NOT NULL;
ALTER TABLE boards ADD FOREIGN KEY (userID) REFERENCES utilisateurs(id) NOT NULL;

CREATE TABLE checkElements (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    idliste INTEGER,
    value VARCHAR(255),
    FOREIGN KEY (idliste) REFERENCES listes(id)
)

CREATE TABLE listes (
    content BOOLEAN NOT NULL DEFAULT 0
) INHERITS (notes);