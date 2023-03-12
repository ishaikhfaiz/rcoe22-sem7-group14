from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
import datetime, sys
from sklearn.cluster import AgglomerativeClustering
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

# Itiernary API
@app.route('/create_itinerary', methods=['POST'])
def create_itinerary():
    plc = request.json['search']

    url = 'Datasets/itinerary module/'+plc+'.csv'
    data = pd.read_csv(url)
    act = data['activity_name'].copy()
    dur = int(len(act) / 3)
    data.drop('activity_name', axis=1, inplace=True)
    data = data.rename_axis('ID').values

    ac = AgglomerativeClustering(n_clusters=dur, affinity='precomputed', linkage='complete')
    clusters = ac.fit_predict(data)

    final_itnr = {}
    for f in range(1, dur+1):
        plcs = []
        k = f'Day {f}'
        for i, e in enumerate(clusters):
            if e == (f - 1):
                plcs.append(act[i])
        final_itnr[k] = plcs

    return jsonify(final_itnr)

# Recommendation API
ds = pd.read_csv("Datasets/Recommendation module/pirs_cbf.csv")

@app.route('/recommendation', methods=['POST'])
def get_recommendations():
    # Get user inputs from request
    budget = int(request.json['budget'])
    y1 = int(request.json['start_year'])
    m1 = int(request.json['start_month'])
    d1 = int(request.json['start_day'])
    y2 = int(request.json['end_year'])
    m2 = int(request.json['end_month'])
    d2 = int(request.json['end_day'])

    # Calculate duration
    d1 = datetime.datetime(y1, m1, d1)
    d2 = datetime.datetime(y2, m2, d2)
    delta = d2 - d1
    dur = int(delta.days)

    # Filter the dataset based on user inputs
    ds_filtered = ds[(ds['min_cost'] < budget) & (ds['max_cost'] > budget) & (ds['min_duration'] < dur) & (ds['max_duration'] > dur)]

    # Check if the filtered dataset has enough rows
    if ds_filtered.shape[0] < 6:
        return jsonify({'error': 'Please try again with different inputs'})

    # Return the filtered dataset
    return ds_filtered.to_json(orient='records')


# Recommend2 API
# Fit the TF-IDF vectorizer on the dataset
tf = TfidfVectorizer()
@app.route('/recommend', methods=['POST'])
def recommend():
    ds = pd.read_csv("Datasets/Recommendation module/pirs_cbf.csv")

    # Parse the JSON payload from the request
    data = request.get_json()

    # Extract user input from the payload
    season = data.get('season')
    going_with = data.get('going_with')
    additional_prefs = data.get('additional_prefs', {})
    budget = int(data.get('budget'))

    # Filter the dataset based on user budget input
    ds_filtered = ds[(ds['min_cost'] < budget) & (ds['max_cost'] > budget)]
    if ds_filtered.shape[0] < 6:
        return jsonify({'error': 'Please try again with different inputs'})

    # Construct user tags from the input
    tags = [season, going_with]
    tags += [additional_prefs.get('bm')] if 'bm' in additional_prefs else []
    tags.insert(1, additional_prefs.get('interest', 'adventure,sightseeing'))

    # Convert tags to a comma-separated string
    usr_tags = ','.join(tags)

    # Append the user input to the filtered dataset
    ds_filtered = ds_filtered.append({'name': 'usr_input', 'tags': usr_tags}, ignore_index=True)

    # Calculate cosine similarities between the user input and all items in the filtered dataset
    x1 = tf.fit_transform(ds_filtered['tags'])
    cosine_similarities_user = linear_kernel(x1[-1:], x1).flatten()

    # Get the top 5 recommendations for the user input
    similar_indices = cosine_similarities_user.argsort()[:-6:-1]
    similar_items = [(cosine_similarities_user[i], ds_filtered['name'][i]) for i in similar_indices]
    recommendations = [{'name': item[1], 'score': item[0]} for item in similar_items[1:]]

    return jsonify(recommendations)

    
if __name__ == "__main__":
    app.run(debug=True, port=7000)