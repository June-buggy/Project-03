#Submission_File Project Team 3
from types import prepare_class
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, render_template
import json
 


from flask import Flask, jsonify


#################################################
# Database Setup
#################################################

# Assuming you have created your engine
engine = create_engine('sqlite:///spotify_database.sqlite')

# Create a Base object and reflect the tables
Base = automap_base()
Base.prepare(autoload_with=engine)

# Print the keys (table names) and mapped classes
#print("Table Names (Keys) in Base.classes:")
#print(list(Base.classes.keys()))
#print("\nMapped Classes in Base.classes:")
#print(Base.classes)

# Save reference to the table
class SpotifyData(Base):
    __tablename__ = 'spotify_data'
    # define columns here...
Spotify = SpotifyData

Spotify = Base.classes.track_data

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/extract"
    )


@app.route("/extract")
def extract():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of passenger data including the name, age, and sex of each passenger"""
    # Query all passengers
    results = session.query(
        Spotify.track_id,
        Spotify.artists,
        Spotify.album_name,
        Spotify.track_name,
        Spotify.popularity,
        Spotify.duration_ms,
        Spotify.explicit,
        Spotify.danceability,
        Spotify.energy,
        Spotify.key_of_track,
        Spotify.loudness,
        Spotify.mode,
        Spotify.speechiness,
        Spotify.acousticness,
        Spotify.instrumentalness,
        Spotify.liveness,
        Spotify.valence,
        Spotify.tempo,
        Spotify.time_signature,
        Spotify.track_genre).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_music = []
    for track_id, artists, album_name, track_name, popularity, duration_ms, explicit, danceability, energy, key, loudness, mode, speechiness, acousticness, instrumentalness, liveness, valence, tempo, time_signature, track_genre in results:
        Spotify_dict = {}
        Spotify_dict["track_id"] = track_id
        Spotify_dict["artists"] = artists
        Spotify_dict["album_name"] = album_name
        Spotify_dict["track_name"] = track_name
        Spotify_dict["popularity"] = popularity
        Spotify_dict["duration_ms"] = duration_ms
        Spotify_dict["explicit"] = explicit
        Spotify_dict["danceability"] = danceability
        Spotify_dict["energy"] = energy
        Spotify_dict["key"] = key
        Spotify_dict["loudness"] = loudness
        Spotify_dict["mode"] = mode
        Spotify_dict["speechiness"] = speechiness
        Spotify_dict["acousticness"] = acousticness
        Spotify_dict["instrumentalness"] = instrumentalness
        Spotify_dict["liveness"] = liveness
        Spotify_dict["valence"] = valence
        Spotify_dict["tempo"] = tempo
        Spotify_dict["time_signature"] = time_signature
        Spotify_dict["track_genre"] = track_genre
        all_music.append(Spotify_dict)

    file2 = open('static/all_JSON.json', 'w')
    file2.write(json.dumps(all_music))
    file2.close

    #pclasslist = [a['pclass'] for a in all_music]
    #pclass_dict = {
    #"pclassind":list(pd.Series(pclasslist).value_counts().index),
    #"pclassvc" :list(pd.Series(pclasslist).value_counts())
    #}

    #file4 = open('static/pclass_JSON.json', 'w')
    #file4.write(json.dumps(pclass_dict))
    #file4.close
    
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
