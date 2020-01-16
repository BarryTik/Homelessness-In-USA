from flask import Flask, render_template, jsonify


homeless_data = {
    "CA": {"year":[2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019],
            "homelessness":[13,14,16,13,16,17,12,17,15,16,18,11,19]},
    "WA": {"year":[2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019],
            "homelessness":[14,13,15,16,13,16,17,12,17,15,16,18,11]}
    }

stateNames = {'AK': 'ALASKA', 'AL': 'ALABAMA', 'AR': 'ARKANSAS', 'AZ': 'ARIZONA', 'CA': 'CALIFORNIA', 'CO': 'COLORADO', 'CT': 'CONNECTICUT', 'DC': 'DISTRICT OF COLUMBIA', 'DE': 'DELAWARE', 'FL': 'FLORIDA', 'GA': 'GEORGIA', 'HI': 'HAWAII', 'IA': 'IOWA', 'ID': 'IDAHO', 'IL': 'ILLINOIS', 'IN': 'INDIANA', 'KS': 'KANSAS', 'KY': 'KENTUCKY', 'LA': 'LOUISIANA', 'MA': 'MASSACHUSETTS', 'MD': 'MARYLAND', 'ME': 'MAINE', 'MI': 'MICHIGAN', 'MN': 'MINNESOTA', 'MO': 'MISSOURI', 'MS': 'MISSISSIPPI', 'MT': 'MONTANA', 'NC': 'NORTH CAROLINA', 'ND': 'NORTH DAKOTA', 'NE': 'NEBRASKA', 'NH': 'NEW HAMPSHIRE', 'NJ': 'NEW JERSEY', 'NM': 'NEW MEXICO', 'NV': 'NEVADA', 'NY': 'NEW YORK', 'OH': 'OHIO', 'OK': 'OKLAHOMA', 'OR': 'OREGON', 'PA': 'PENNSYLVANIA', 'PR': 'PUERTO RICO', 'RI': 'RHODE ISLAND', 'SC': 'SOUTH CAROLINA', 'SD': 'SOUTH DAKOTA', 'TN': 'TENNESSEE', 'TX': 'TEXAS', 'UT': 'UTAH', 'VA': 'VIRGINIA', 'VT': 'VERMONT', 'WA': 'WASHINGTON', 'WI': 'WISCONSIN', 'WV': 'WEST VIRGINIA', 'WY': 'WYOMING'}
 
def uniform(input):
    if input.upper() in stateNames:
        return input.upper()
    else:
        for state in stateNames:
            if input.upper() == stateNames[state]:
                return state
        else:
            return "ERROR"

app = Flask(__name__)

@app.route("/")
def index():
    print("index page requested")
    return render_template("index.html")

@app.route("/<state_name>")
def state_info(state_name):
    state_name = uniform(state_name)
    full_state_name = stateNames[state_name].title()

    print(f"{state_name} page requested")

    print(homeless_data[state_name]["homelessness"])
    return render_template("states.html", state = state_name, full_state_name = full_state_name)

@app.route("/data/<state_name>")
def api_data(state_name):
    state_name = uniform(state_name)
    print(f"{state_name} JSON requested")
    return jsonify(homeless_data[state_name])




if __name__ =="__main__":
    app.run(debug=True)