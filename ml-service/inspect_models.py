import joblib
import os
import sklearn

models = [
    "decision_tree_model.pkl",
    "random_forest_model.pkl",
    "time_series_model.pkl"
]

base_path = "/Users/rutuja/Downloads/Farm-Hub/ml-service"

for model_name in models:
    path = os.path.join(base_path, model_name)
    print(f"\n--- Checking {model_name} ---")
    if os.path.exists(path):
        try:
            model = joblib.load(path)
            print(f"Type: {type(model)}")
            
            # Check for feature names (scikit-learn >= 1.0)
            if hasattr(model, "feature_names_in_"):
                print(f"Features: {model.feature_names_in_.tolist()}")
            elif hasattr(model, "n_features_in_"):
                print(f"Number of features: {model.n_features_in_}")
            
            # For classifiers, check classes
            if hasattr(model, "classes_"):
                print(f"Classes: {model.classes_.tolist()}")
                
        except Exception as e:
            print(f"Error loading {model_name}: {e}")
    else:
        print(f"File {model_name} not found.")
