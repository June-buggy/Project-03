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
engine = create_engine('sqlite:///spotify.sqlite')

# Create a Base object and reflect the tables
Base = automap_base()
Base.prepare(engine, reflect=True)

# Print the keys (table names) and mapped classes
print("Table Names (Keys) in Base.classes:")
print(list(Base.classes.keys()))

print("\nMapped Classes in Base.classes:")
print(Base.classes)