import numpy as np

from flask import Flask, render_template, jsonify

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

stateNames = {'AK': 'ALASKA', 'AL': 'ALABAMA', 'AR': 'ARKANSAS', 'AZ': 'ARIZONA', 'CA': 'CALIFORNIA', 'CO': 'COLORADO', 'CT': 'CONNECTICUT', 'DC': 'DISTRICT OF COLUMBIA', 'DE': 'DELAWARE', 'FL': 'FLORIDA', 'GA': 'GEORGIA', 'GU': 'GUAM', 'HI': 'HAWAII', 'IA': 'IOWA', 'ID': 'IDAHO', 'IL': 'ILLINOIS', 'IN': 'INDIANA', 'KS': 'KANSAS', 'KY': 'KENTUCKY', 'LA': 'LOUISIANA', 'MA': 'MASSACHUSETTS', 'MD': 'MARYLAND', 'ME': 'MAINE', 'MI': 'MICHIGAN', 'MN': 'MINNESOTA', 'MO': 'MISSOURI', 'MS': 'MISSISSIPPI', 'MT': 'MONTANA', 'NC': 'NORTH CAROLINA', 'ND': 'NORTH DAKOTA', 'NE': 'NEBRASKA', 'NH': 'NEW HAMPSHIRE', 'NJ': 'NEW JERSEY', 'NM': 'NEW MEXICO', 'NV': 'NEVADA', 'NY': 'NEW YORK', 'OH': 'OHIO', 'OK': 'OKLAHOMA', 'OR': 'OREGON', 'PA': 'PENNSYLVANIA', 'PR': 'PUERTO RICO', 'RI': 'RHODE ISLAND', 'SC': 'SOUTH CAROLINA', 'SD': 'SOUTH DAKOTA', 'TN': 'TENNESSEE', 'TX': 'TEXAS', 'UT': 'UTAH', 'VA': 'VIRGINIA', 'VI': 'VIRGIN ISLANDS','VT': 'VERMONT', 'WA': 'WASHINGTON', 'WI': 'WISCONSIN', 'WV': 'WEST VIRGINIA', 'WY': 'WYOMING'}


engine = create_engine(f'sqlite:///HomelessOwl_db.db')
print(engine)


Base = automap_base()
# print(Base)
Base.prepare(engine, reflect=True)
# print(Base)
homelessPIT = Base.classes.pit
homelessHIC = Base.classes.hic

homeless = Base.classes.homeless 
population = Base.classes.population



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


@app.route("/data")
def data():
    print("data page requested")
    session = Session(engine)

    resultsHomeless = session.query(homeless.state, homeless.year,homeless.overallhomeless, homeless.shelteredhomeless, homeless.unshelteredhomeless, homeless.individualhomeless, homeless.infamilyhomeless, homeless.chronichomeless, homeless.veteranhomeless).all()
    resultsBeds = session.query(homelessHIC.state, homelessHIC.beds, homelessHIC.year).all()
    resultsPop = session.query(population.state, population.pop2007, population.pop2008, population.pop2009, population.pop2010, population.pop2011, population.pop2012, population.pop2013, population.pop2014, population.pop2015, population.pop2016, population.pop2017, population.pop2018, population.pop2019).all()

    session.close()

    allData = {}

    for item in resultsHomeless:
        state = item[0]
        year = item[1]
        overall_homeless = item[2]
        sheltered_homeless = item[3]
        unsheltered_homeless = item[4]
        individual_homeless = item[5]
        in_family_homeless = item[6]
        chronic_homeless = item[7]
        veteran_homeless = item[8]


        found = False

        for key in allData:
            if state == key:
                allData[key][year] = {"categories":{"overall homeless":overall_homeless, "sheltered homeless":sheltered_homeless, "unsheltered homeless":unsheltered_homeless, "individual homeless":individual_homeless, "in family homeless":in_family_homeless, "chronic homeless":chronic_homeless, "veteran homeless":veteran_homeless}}
                found = True
        if not found:
            allData[state] = {year: {"categories":{"overall homeless":overall_homeless, "sheltered homeless":sheltered_homeless, "unsheltered homeless":unsheltered_homeless, "individual homeless":individual_homeless, "in family homeless":in_family_homeless, "chronic homeless":chronic_homeless, "veteran homeless":veteran_homeless}}}

    for item in resultsBeds:
        state = item[0]
        beds = item[1]
        year = item[2]

        for key in allData:
            if key == state:
                allData[key][year]["beds"] = beds

    for item in resultsPop:
        state = item[0]
        pop = [ item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10], item[11], item[12], item[13] ]

        for key in allData:
            if key == uniform(state):
                for index, year in enumerate(allData[key]):
                    allData[key][year]["total state population"] = pop[index]

    return allData

@app.route("/about")
def about():
    return render_template("about.html")

if __name__ =="__main__":
    app.run(debug=True)
