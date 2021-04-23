import pandas as pd
import itertools
from tqdm import tqdm
import random

df = pd.read_csv('../data/normalized_one_hot.csv')

for index, row in tqdm(df.iterrows()):
    # perhaps augment self data in future?
    # for i in range(1, 4):
    #     dx_cols = [x for x, y in row.items() if "cancer_dx_" in x]
    #     dx_types = [row[name] for name in dx_cols if 'type' in name]
    #     dx_ages = [row[name] for name in dx_cols if 'age' in name]



    all_rel_data = []
    for i in range(1, 24):
        # rel relation 1-23
        # rel cancer 1-10
        # rel age 1-3

        #gets each rel columns
        rel_cols = [x for x, y in row.items() if f"rel_{i}_" in x]
        
        rel_relations = [row[name] for name in rel_cols if 'relationship' in name]
        rel_cancers = [row[name] for name in rel_cols if 'cancer' in name]
        rel_ages = [row[name] for name in rel_cols if 'age' in name]

        #permutations for CANCERS/AGES for 1 relative
        # rel_cancer_perms = [list(x) for x in list(itertools.permutations(rel_cancers))]
        # rel_age_perms = [list(x) for x in list(itertools.permutations(rel_ages))]
        
        # all_rel_permutations.append({
        #     f"rel_{i}_relationship": rel_relations[0],
        #     f"rel_{i}_cancer_perms": rel_cancer_perms,
        #     f"rel_{i}_age_perms": rel_age_perms
        #     })

        all_rel_data.append({
            'relationship': rel_relations[0],
            'cancers': rel_cancers,
            'ages': rel_ages
        })
    
    # print(all_rel_data)
    
    for x in range(1, 11):
        shuffled = random.sample(all_rel_data, len(all_rel_data))
    
        d_init = {
            'Pathogenic?': row['Pathogenic?'],
            'history_class': row['history_class'],
            'ethnicity': row['ethnicity'],
            'cancer_dx': row['cancer_dx'],
            'known_brca': row['known_brca'],
            'cancer_dx_type_1': row['cancer_dx_type_1'],
            'cancer_dx_age_1': row['cancer_dx_age_1'],
            'cancer_dx_type_2': row['cancer_dx_type_2'],
            'cancer_dx_age_2': row['cancer_dx_age_2'],
            'cancer_dx_type_3': row['cancer_dx_type_3'],
            'cancer_dx_age_3': row['cancer_dx_age_3'],
        }

        for y in range(1, 24):
            d_init[f"rel_{y}_relationship"] = shuffled[x-1]["relationship"]

            for z in range(len(shuffled[x-1]["cancers"])):
                d_init[f"rel_{y}_cancer_{z+1}"] = shuffled[x-1]["cancers"][z]
            
            for w in range(len(shuffled[x-1]["ages"])):
                d_init[f"rel_{y}_age_{w+1}"] = shuffled[x-1]["ages"][w]
        
        for k, v in d_init.items():
            d_init[k] = [int(v)]
        new_df = pd.DataFrame(data = d_init)
        df = df.append(new_df)

df.to_csv('ihopethisworksispent3hrsonthis.csv', index = False)


    # patient_rel_perms = [dict(x) for x in list(itertools.permutations(all_rel_data))]
    # print(len(all_rel_data))

    # for i in range(1, 24):

