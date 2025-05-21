from docx import Document

from docx.text.paragraph import Paragraph
from docx.table import Table


def iter_doc_paragraphs(doc: Document):
    for p in doc.iter_inner_content():
        if isinstance(p, Paragraph):
            yield p

        elif isinstance(p, Table):
            for row in p.rows:
                for cell in row.cells:
                    for paragraph in cell.paragraphs:
                        yield paragraph
