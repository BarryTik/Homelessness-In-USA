from flask import Flask, render_template


homeless_data = {
    "CA": {2010:15,2011:14,2012:14,2013:15},
    "WA": {2010:14,2011:15,2012:15,2013:14}
    }

app = Flask(__name__)

@app.route("/")
def index():
    print("index page requested")
    return render_template("index.html")

@app.route("/<state_name>")
def state_info(state_name):
    print(f"{state_name} page requested")
    return render_template("states.html", state = state_name, state_data = homeless_data[state_name])




if __name__ =="__main__":
    app.run(debug=True)