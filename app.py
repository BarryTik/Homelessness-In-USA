import numpy as np

from flask import Flask, render_template, jsonify

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


stateNames = {'AK': 'ALASKA', 'AL': 'ALABAMA', 'AR': 'ARKANSAS', 'AZ': 'ARIZONA', 'CA': 'CALIFORNIA', 'CO': 'COLORADO', 'CT': 'CONNECTICUT', 'DC': 'DISTRICT OF COLUMBIA', 'DE': 'DELAWARE', 'FL': 'FLORIDA', 'GA': 'GEORGIA', 'HI': 'HAWAII', 'IA': 'IOWA', 'ID': 'IDAHO', 'IL': 'ILLINOIS', 'IN': 'INDIANA', 'KS': 'KANSAS', 'KY': 'KENTUCKY', 'LA': 'LOUISIANA', 'MA': 'MASSACHUSETTS', 'MD': 'MARYLAND', 'ME': 'MAINE', 'MI': 'MICHIGAN', 'MN': 'MINNESOTA', 'MO': 'MISSOURI', 'MS': 'MISSISSIPPI', 'MT': 'MONTANA', 'NC': 'NORTH CAROLINA', 'ND': 'NORTH DAKOTA', 'NE': 'NEBRASKA', 'NH': 'NEW HAMPSHIRE', 'NJ': 'NEW JERSEY', 'NM': 'NEW MEXICO', 'NV': 'NEVADA', 'NY': 'NEW YORK', 'OH': 'OHIO', 'OK': 'OKLAHOMA', 'OR': 'OREGON', 'PA': 'PENNSYLVANIA', 'PR': 'PUERTO RICO', 'RI': 'RHODE ISLAND', 'SC': 'SOUTH CAROLINA', 'SD': 'SOUTH DAKOTA', 'TN': 'TENNESSEE', 'TX': 'TEXAS', 'UT': 'UTAH', 'VA': 'VIRGINIA', 'VT': 'VERMONT', 'WA': 'WASHINGTON', 'WI': 'WISCONSIN', 'WV': 'WEST VIRGINIA', 'WY': 'WYOMING'}

username = "postgres"
password = "53uLWg4^d3P8yYZJ"
engine = create_engine(f'postgresql://{username}:{password}@localhost:5432/HomelessOwl_db')
print(engine)


Base = automap_base()
# print(Base)
Base.prepare(engine, reflect=True)
# print(Base)
homelessPIT = Base.classes.pit
homelessHIC = Base.classes.hic



def uniform(input):
    if input.upper() in stateNames:
        return input.upper()
    else:
        for state in stateNames:
            if input.upper() == stateNames[state]:
                return state
        else:
            return "ERROR FINDING STATE"

app = Flask(__name__)

@app.route("/")
def index():
    print("index page requested")
    return render_template("index.html")

@app.route("/<state_name>")
def state_info(state_name):
    print(f"{state_name} page requested")
    state_name = uniform(state_name)
    full_state_name = stateNames[state_name].title()
    print(state_name)
    print(full_state_name)


    return render_template("states.html", state = state_name, full_state_name = full_state_name)


@app.route("/data/PIT")
def dataPIT():
    print("PIT data page requested")
    session = Session(engine)

    results = session.query(homelessPIT.state, homelessPIT.homelessness, homelessPIT.year).all()
    
    session.close()

    # print(results)
    PIT_data = {}
    for item in results:
        state = item[0]
        homelessness = item[1]
        year = item[2]

        found = False
        for key in PIT_data:
            if state == key:
                PIT_data[key][year]=homelessness
                found = True
        if not found:
            PIT_data[state] = {year: homelessness}

    # print(PIT_data)
       

    return jsonify(PIT_data)


@app.route("/data/HIC")
def dataHIC():
    print("HIC data page requested")
    session = Session(engine)

    results = session.query(homelessHIC.state, homelessHIC.beds, homelessHIC.year).all()

    session.close()

    HIC_data = {}
    for item in results:
        state = item[0]
        beds = item[1]
        year = item[2]

        found = False
        for key in HIC_data:
            if state == key:
                HIC_data[key][year]=beds
                found = True
        if not found:
            HIC_data[state] = {year: beds}

    # print(HIC_data)
       

    return jsonify(HIC_data)


if __name__ =="__main__":
    app.run(debug=True)