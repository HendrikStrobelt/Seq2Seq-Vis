### Install Faiss

```bash
brew install --with-clang llvm
PATH=$PATH:/usr/local/opt/llvm/bin
brew install swig
conda install swig
git clone https://github.com/facebookresearch/faiss.git
cd faiss
cp example_makefiles/makefile.inc.Mac.brew ./makefile.inc
make tests/test_blas
./tests/test_blas
make
make py
python -c "import faiss
python -c "import faiss, numpy
faiss.Kmeans(10, 20).train(numpy.random.rand(1000, 10).astype('float32'))"
```