import pandas as pd

def load_top_data(file_path):
    df = pd.read_csv(file_path)
    print(df.shape)
    print(df.columns)
    print(df.head())
    return df.head()

def load_all_data(file_path):
    df = pd.read_csv(file_path)
    print(df.shape)
    return df

def check_null_values(df):
    print(df.isnull().sum())
    return df.isnull().sum()

def check_duplicate_values(df):
    print(df.duplicated().sum())
    return df.duplicated().sum()

def drop_duplicate_values(df):
    df = df.drop_duplicates()
    return df

def text_cleaner(df):
    df = df.applymap(lambda x: x.lower() if isinstance(x, str) else x)
    # print(df.head())
    return df

def missing_values_cleaner(df):
    missing_percent = df.isnull().sum() / len(df)
    # print(missing_percent)
    for col, percent in missing_percent.items():
        if percent > 0.6:
            df.drop(col, axis=1, inplace=True)
        else:
            if pd.api.types.is_numeric_dtype(df[col]):
                df[col] = df[col].fillna(df[col].median())
            else:
                df[col] = df[col].fillna(df[col].mode()[0])
    
    df.drop('expiry', axis=1, inplace=True)
    df.drop('listed_time', axis=1, inplace=True)
    df.drop('original_listed_time', axis=1, inplace=True)
    df.drop('application_url', axis=1, inplace=True)
    df.drop('job_posting_url', axis=1, inplace=True)
    df.drop('posting_domain', axis=1, inplace=True)
    df.drop('views', axis=1, inplace=True)
    # print(df.isnull().sum())
    return df

def save_cleaned_data(df, file_path):
    df.to_csv(file_path, index=False)
    # print(df.shape)
    print(df.columns)
    return df

# load_top_data("../data/postings.csv")
# load_all_data("../data/postings.csv")
# check_null_values(load_all_data("../data/postings.csv"))
# check_duplicate_values(load_all_data("../data/postings.csv"))
# drop_duplicate_values(load_all_data("../data/postings.csv"))