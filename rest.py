#models.py

class Bids(models.Model):

    name = models.CharField(verbose_name="Имя", max_length=50)
    date = models.DateTimeField(verbose_name=("Дата заявки"), auto_now=False, auto_now_add=True, blank=True, null=True)
    phone = models.CharField(verbose_name="Номер без (+7)", default="7776665544", max_length=12)
    select = models.CharField(verbose_name="Выбранная услуга", max_length=50)
    who = models.ForeignKey("Teacher", verbose_name=("Врач"), on_delete=models.CASCADE, related_name="bids_who", null=True, blank=True)   #models.IntegerField(verbose_name="id Врача")
    is_completed = models.BooleanField(verbose_name=("Выполенно"), default=False)
    someInfo = models.TextField(verbose_name=("Дополнительная информация"), blank=True, null=True)
    customer = models.ForeignKey("Teacher", verbose_name=("Заказчик"), on_delete=models.CASCADE, related_name="bids_customer", blank=True, null=True)
    
    in_med_center = models.BooleanField(verbose_name=("Заявка у клиники?"), default=False)
    med_center = models.ForeignKey("MedicalCenter", verbose_name=("Мед Центер"), on_delete=models.CASCADE, null=True, blank=True)

    show_phone = models.BooleanField(verbose_name=("Просмотрел врач номер"), default=False)
    date_show_phone = models.DateTimeField(verbose_name=("Время когда врач посмотрел номер"), auto_now=True, auto_now_add=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('Заявка')
        verbose_name_plural = _('Заявки') 
		
		
#urls.py
from django.urls import path
from rest_framework import routers
from .views import *
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView)

router = routers.SimpleRouter()
router.register('bid', BidViewSet, basename='bid')

#тут у тебя кастомные url если делать через viewset тогда в urlpatterns прописывать еще раз не нужно

urlpatterns = [
    path('api-token/', TokenObtainPairView.as_view()),
    path('api-token-refresh/', TokenRefreshView.as_view()),
    path('user-info/', GetUserInfo.as_view()),
    path('get-curr-doc/<int:pk>/', GetCurrDoc)
]
urlpatterns += router.urls # главное к обычным юрлам добавить пути роутера

# views.py
class BidViewSet(viewsets.ModelViewSet):
    allowed_methods = ('GET',)
    queryset = Bids.objects.order_by('-date')
    serializer_class = BidSerializer
	
#serializers.py
class BidSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bids
        fields = '__all__'
        depth=1 # это устанавливает "глубину" если использовать без этого параметра то ForeignKey будут показывать чисто id 
				#а если с этой глубиной то будет в итоговом json файле еще и поля той модели на которую указывает ForeignKey