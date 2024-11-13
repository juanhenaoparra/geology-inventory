"""
Paginación de resultados
"""

from typing import List
import math

class Pagination:
    """Clase de paginación"""
    def __init__(self,
                 items: List[dict],
                 total: int,
                 page: int = 1,
                 page_size: int = 10):
        self.page = page
        self.page_size = page_size
        self.total = total
        self.items = items
        self.pages = math.ceil(total / page_size)
        self.has_next = self.page < self.pages
        self.has_prev = self.page > 1
