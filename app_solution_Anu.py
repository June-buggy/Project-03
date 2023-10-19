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
engine = create_engine("sqlite:///database.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the table
Tracks = Base.classes.tracks

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

    """Return a list of all tracks data including the name, age, and sex of each passenger"""
    # Query all passengers
    results = session.query(Tracks.track_name, Tracks.popularity, Tracks.danceability, Tracks.track_genre).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all tracks
    all_tracks = []
    for track_name, popularity, danceability, track_genre in results:
        tracks_dict = {}
        tracks_dict["track_name"] = track_name
        tracks_dict["popularity"] = popularity
        tracks_dict["track_genre"] = track_genre
        tracks_dict.append(tracks_dict)

    file2 = open('static/allp_JSON.json', 'w')
    file2.write(json.dumps(all_tracks))
    file2.close

    pclasslist = [a['pclass'] for a in all_tracks]
    pclass_dict = {
    "pclassind":list(pd.Series(pclasslist).value_counts().index),
    "pclassvc" :list(pd.Series(pclasslist).value_counts())
    }

    file4 = open('static/pclass_JSON.json', 'w')
    file4.write(json.dumps(pclass_dict))
    file4.close

    return render_template('home.html')

if __name__ == '__main__':
    app.run(debug=True)
