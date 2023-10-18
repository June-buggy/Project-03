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
engine = create_engine("sqlite:///titanic.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the table
Passenger = Base.classes.passenger

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
    results = session.query(Passenger.name, Passenger.age, Passenger.sex, Passenger.pclass).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_passengers = []
    for name, age, sex, pclass in results:
        passenger_dict = {}
        passenger_dict["name"] = name
        passenger_dict["age"] = age
        passenger_dict["sex"] = sex
        passenger_dict["pclass"] = pclass
        all_passengers.append(passenger_dict)

    file2 = open('static/allp_JSON.json', 'w')
    file2.write(json.dumps(all_passengers))
    file2.close

    pclasslist = [a['pclass'] for a in all_passengers]
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
