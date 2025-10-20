### Setup Project

Ensure that download ´uv´. If you not still installed (if already installed ignore this steps), following theses steps:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh # Linux/Mac
```

```bash
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex" # Windows
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/0.9.4/install.ps1 | iex"
```

Create a new virtual env for this project:

```bash
uv venv --python=3.13
```

Active the virtual env

```bash
source .venv/bin/activate # Linux/Mac

.venv\Scripts\activate # Windows
```

Install all packages used in this project

```
uv sync
```

Done 😎!

### Homework 1

source dataset: https://www.kaggle.com/datasets/poushal02/student-academic-stress-real-world-dataset?resource=download