import traceback
from collections import defaultdict
from pathlib import Path

import psycopg2

st = set()
with open('nouns', 'r') as f:
    for i in f:
        st.add(i.strip().lower())

con = psycopg2.connect("dbname=books user=admin host=localhost password=7G10jVrsOcqSmjBfmXm6BoJxy")
with con.cursor() as cur:
    for i in Path('book/').rglob('*.txt'):
        print(i)
        stats = defaultdict(int)
        try:
            with open(i, 'r', encoding='koi8-r') as f:
                for j in f:
                    for k in j.split():
                        kk = k.strip().lower()
                        if kk in st:
                            stats[kk] += 1
            cur.execute("INSERT INTO books(url) VALUES (%s) RETURNING id", (str(i),))
            _id = cur.fetchone()[0]
            cur.execute("INSERT INTO words_count(book_id, word, count) VALUES (%s, UNNEST(%s::varchar[]), UNNEST(%s::integer[]))",
                        (_id, list(stats.keys()), list(stats.values())))
            con.commit()
        except Exception as e:
            traceback.print_exception(e)