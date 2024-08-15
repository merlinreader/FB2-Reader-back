import psycopg2


con = psycopg2.connect("dbname=postgres user=postgres host=localhost password=7G10jVrsOcqSmjBfmXm6BoJxy")
def delimited(file, delimiter='|', bufsize=4096):
    buf = ''
    while True:
        newbuf = file.read(bufsize)
        if not newbuf:
            yield buf
            return
        buf += newbuf
        lines = buf.split(delimiter)
        for line in lines[:-1]:
            yield line
        buf = lines[-1]

urls = []
names = []
authors = []
with open('listing.csv', 'r') as f:
    lst = list(delimited(f))
    print(len(lst))

    for idx in range(len(lst) // 5):
        urls.append(f"https://lib.ru/{lst[idx * 5 + 2]}.fb2.zip")
        names.append(f"{lst[idx * 5].replace(' ', '. ')}.\n{lst[idx * 5 + 1]}".strip())
with con.cursor() as cur:
    cur.execute("""
UPDATE books b
SET name=f.name
FROM (SELECT UNNEST(%s::varchar[]), UNNEST(%s::varchar[])) as f(url, name)
WHERE b.url=f.url;
""", (urls, names))
con.commit()
con.close()