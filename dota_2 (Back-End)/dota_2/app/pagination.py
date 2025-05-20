from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 100  # стандартная пагинация

    def paginate_queryset(self, queryset, request, view=None):
        if request.query_params.get('page') == 'all':
            return None  # отключает пагинацию
        return super().paginate_queryset(queryset, request, view)
