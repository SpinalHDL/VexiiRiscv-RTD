=========
SpinalDoc
=========

This is the documentation repository for
`SpinalHDL <https://github.com/SpinalHDL/VexiiRiscv>`_.

It is published on
`spinalhdl.github.io/VexiiRiscv-RTD <https://spinalhdl.github.io/VexiiRiscv-RTD/master/index.html>`_.

How to build this documentation
===============================

With venv
----------

Requirements (system)

* make
* git

Create a virtual environment with pipenv (will use the Pipfile for installing the necessary packages)

.. code:: shell

   python3 -m venv .venv

then you can activate the virtual enviroment (in bash) and install the dependencies

.. code:: shell

   source .venv/bin/activate
   pip install -r requirements.txt

and then you can use ``make`` the usual way

.. code:: shell

   make html     # for html
   make latex    # for latex
   make latexpdf # for latex (will require latexpdf installed)
   make          # list all the available output format

all the outputs will be in docs folder (for html: docs/html)


Native
-------

Requirements (system):

* make
* git

Requirements (Python 3):

* sphinx
* sphinx-rtd-theme
* sphinxcontrib-wavedrom
* sphinx-multiversion

After installing the requirements you can run

.. code:: shell

   make html     # for html
   make latex    # for latex
   make latexpdf # for latex (will require latexpdf installed)
   make          # list all the available output format

you can create build multiple version of the doc via

.. code:: shell

   sphinx-multiversion source docs/html

in the docs/html there will be a folder with the builded doc for each branch and tag
