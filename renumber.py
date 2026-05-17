import json

file_path = 'D:\\Software Development\\Porfolio\\deevoops\\devoops-agents\\feature_list.json'

with open(file_path, 'r') as f:
    data = json.load(f)

features = data['features']
new_features = []
for i, f in enumerate(features):
    new_features.append({**f, 'id': i + 1})

data['features'] = new_features

with open(file_path, 'w') as f:
    json.dump(data, f, indent=2)
