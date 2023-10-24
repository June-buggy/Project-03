import sqlite3
import pandas as pd

# Step 1. Load data file
df = pd.read_csv('dataset.csv')

# Step 2. Data Clean up
df. columns = df.columns.str.strip()

# Step3. Create?connect to SQllite database
connection = sqlite3.connect('music.db')

# Step4. Load datafile to SQLLite
#fail:replace;append
df.to_sql('spotify_data', connection, if_exists='replace' )

# Step 5. cllose the connection
connection.close()

# Viewer of db : https://inloop.github.io/sqlite-viewer/