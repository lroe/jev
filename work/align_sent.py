import json, re, difflib

script = open('../Narration (TTS ready).md').read()
# paragraphs
paras = [p.strip() for p in script.split('\n') if p.strip()]
# sentences
sents = []
for pi,p in enumerate(paras):
    # split on sentence end followed by space+capital
    parts = re.split(r'(?<=[.!?])\s+', p)
    for si,s in enumerate(parts):
        if s.strip(): sents.append((len(sents), pi, s.strip()))

def norm_token(t):
    t = t.lower().replace('’',"'")
    t = t.replace('&','and')
    t = re.sub(r"[^a-z0-9']", '', t)
    return t

def norm_words(s):
    s = s.replace('’',"'")
    s = re.sub(r'\bU L M Fit\b', 'ULMFiT', s)
    s = re.sub(r'\bU L M\b', 'ULM', s)
    s = re.sub(r'\bG P T two\b', 'GPT2', s)
    s = re.sub(r'\bG P T\b', 'GPT', s)
    s = re.sub(r'\bA P I\b', 'API', s)
    s = re.sub(r'\bR L C D\b', 'RLCD', s)
    s = re.sub(r'\bR L C R\b', 'RLCR', s)
    s = re.sub(r'\bBERT\b', 'Bert', s)
    toks = re.findall(r"[A-Za-z0-9']+", s)
    out=[]
    for t in toks:
        n=norm_token(t)
        if n: out.append(n)
    # merge spelled single letters sequences? handled above
    return out

script_words=[]   # (word, sent_index)
for si,pi,s in sents:
    for w in norm_words(s):
        script_words.append((w,si))

# whisper words: merge "G P T" sequences? check
wd = json.load(open('whisper_words.json'))['words']
raw = [(w['word'].strip(), w['start'], w['end']) for w in wd]
# whisper word cleaning; merge single letters G P T / U L M / R L C D
def wn(t):
    return norm_token(t)
whis=[]  # (norm, start, end)
i=0
letters = {'g','p','t','u','l','m','r','c','d','a','i','b','e','f','n','s','v','x','y','z','k','o'}
while i < len(raw):
    w,st,en = raw[i]
    n = wn(w)
    # merge sequences of single letters (up to 5)
    if len(n)==1 and n.isalpha():
        seq=[n]; j=i+1
        while j < len(raw) and len(wn(raw[j][0]))==1 and wn(raw[j][0]).isalpha() and j-i<6:
            seq.append(wn(raw[j][0])); j+=1
        if len(seq)>=2:
            wh = (''.join(seq), st, raw[j-1][2])
            whis.append(wh)
            i=j
            continue
    whis.append((n,st,en))
    i+=1

# DP align script_words -> whisper
sw=[w for w,_ in script_words]
hw=[w for w,_,_ in whis]
N,M=len(sw),len(hw)
import numpy as np
INF=1e9
dp=np.full((N+1,M+1),INF,dtype=np.float32)
dp[0,0]=0
# costs
def cost(a,b):
    if a==b: return 0.0
    r=difflib.SequenceMatcher(None,a,b).ratio()
    if r>0.85: return 0.15
    if r>0.7: return 0.5
    return 1.0
for i in range(1,N+1): dp[i,0]=i*0.6
for j in range(1,M+1): dp[0,j]=j*0.6
for i in range(1,N+1):
    a=sw[i-1]
    row=dp[i]; prev=dp[i-1]
    for j in range(1,M+1):
        c=cost(a,hw[j-1])
        v=prev[j-1]+c
        d=prev[j]+0.6
        ins=row[j-1]+0.6
        if d<v: v=d
        if ins<v: v=ins
        row[j]=v
# backtrack
i,j=N,M
match={}
while i>0 or j>0:
    if i>0 and j>0 and dp[i,j]==dp[i-1,j-1]+cost(sw[i-1],hw[j-1]):
        match[i-1]=j-1; i-=1; j-=1
    elif i>0 and dp[i,j]==dp[i-1,j]+0.6:
        i-=1
    else:
        j-=1

# sentence spans
sent_span={}
for idx,(w,si) in enumerate(script_words):
    if idx in match:
        st=whis[match[idx]][1]
        if si not in sent_span: sent_span[si]=[st,st]
        sent_span[si][0]=min(sent_span[si][0],st)
        sent_span[si][1]=max(sent_span[si][1],whis[match[idx]][2])
print('sentences',len(sents),'aligned',len(sent_span))
out=[]
for si,pi,s in sents:
    if si in sent_span:
        a,b=sent_span[si]
        out.append({'i':si,'p':pi,'start':round(a,3),'end':round(b,3),'text':s})
    else:
        out.append({'i':si,'p':pi,'start':None,'end':None,'text':s})
json.dump(out,open('sent_times.json','w'),indent=1)
for o in out:
    if o['start'] is None:
        print('MISSING',o['i'],o['text'][:80])
    else:
        prev=out[o['i']-1]['end'] if o['i']>0 and out[o['i']-1]['end'] else o['start']
        print(f"{o['i']:3d} p{o['p']:3d} {o['start']:7.2f}-{o['end']:7.2f} gap{o['start']-prev:5.2f} wc{len(o['text'].split()):3d} {o['text'][:90]}")
